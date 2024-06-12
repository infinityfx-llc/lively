import { CachableKey } from "./cache";
import Clip, { ClipConfig, ClipProperties, CompositeType } from "./clip";
import { Link, isLink } from "./link";
import Track, { TransitionOptions } from "./track";
import { IndexedMap, merge } from "./utils";

export type PlayOptions = { composite?: CompositeType; immediate?: boolean; reverse?: boolean; delay?: number; commit?: boolean; };

export default class Timeline {

    index: number = 0;
    stagger: number;
    staggerLimit: number;
    deform: boolean;
    cachable?: CachableKey[];
    paused: boolean = false;
    tracks: IndexedMap<Element, Track> = new IndexedMap();
    frame: number = 0;
    linked: (() => void)[] = [];
    mounted: boolean = false;
    mountClips: Clip[];

    constructor({ stagger = 0.1, staggerLimit = 10, deform = true, cachable, mountClips }: { stagger?: number; staggerLimit?: number; deform?: boolean; cachable?: CachableKey[]; mountClips: Clip[]; }) {
        this.stagger = stagger;
        this.staggerLimit = staggerLimit - 1;
        this.deform = deform;
        this.cachable = cachable;
        this.mountClips = mountClips;
    }

    step() {
        cancelAnimationFrame(this.frame);

        if (!this.paused) this.tracks.stack.forEach((track, i) => track.step(i));

        this.frame = requestAnimationFrame(this.step.bind(this));
    }

    time(clip: Clip) {
        if (!this.tracks.size) return 0;

        return clip.duration + clip.delay + this.stagger * Math.max(Math.min(this.staggerLimit, this.tracks.size - 1), 0);
    }

    private receiver(prop: string, link: Link<any>, config: ClipConfig) {
        if (this.paused) return;

        for (let i = 0; i < this.tracks.size; i++) {
            const track = this.tracks.stack[i],
                value = link(i);

            if (config.duration) {
                merge(config, { composite: 'override' }); // optimize syntax?

                new Clip({ ...config, [prop]: value }).play(track, {});
            } else {
                track.apply(prop, value);
                track.correct();
            }
        }
    }

    link(clip?: ClipProperties | Clip) {
        this.step();
        
        if (this.linked.length || !clip || clip instanceof Clip) return;

        for (let prop in clip) {
            const link = clip[prop as keyof ClipProperties];

            if (isLink(link)) {
                const receiver = this.receiver.bind(this, prop, link);
                link.subscribe(receiver);
                this.linked.push(() => link.unsubscribe(receiver));

                receiver({});
            }
        }
    }

    unlink() {
        this.linked.forEach(unsubscribe => unsubscribe());
        this.linked = [];
    }

    transition(from: Timeline | undefined, options: TransitionOptions = {}) {

        for (let i = 0; i < this.tracks.size; i++) {

            this.tracks.stack[i].transition(from?.tracks.stack[i], options);
        }
    }

    insert(element: any) {
        if ((element instanceof HTMLElement || element instanceof SVGElement) && !this.tracks.has(element)) {
            const track = new Track(element, this.deform, this.cachable);
            this.tracks.set(element, track);

            if (this.mounted) this.mountClips.forEach(clip => clip.play(track, {}));
        }
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0, commit }: PlayOptions) {
        let i = 0, track: Track;

        while (track = this.tracks.stack[i]) {
            if (!track.element.isConnected) {
                this.tracks.delete(track.element);
                continue;
            }

            if (immediate) track.clear();

            clip.play(track, {
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.size : 1) * Math.abs(this.stagger),
                composite,
                reverse,
                commit
            });

            i++;
        }
    }

    pause(value: boolean) {
        for (const track of this.tracks.stack) track.pause(value);

        this.paused = value;
    }

    cache() {
        for (const track of this.tracks.stack) track.cache.update();
    }

}