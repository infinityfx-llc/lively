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

        this.tracks.values.forEach((track, i) => track.step(i));

        this.frame = requestAnimationFrame(this.step.bind(this));
    }

    time(clip: Clip) {
        return clip.duration + clip.delay + this.stagger * Math.max(Math.min(this.staggerLimit, this.tracks.size - 1), 0);
    }

    private receiver(prop: string, link: Link<any>, config: ClipConfig) {
        if (this.paused) return;

        for (let i = 0; i < this.tracks.size; i++) {
            const track = this.tracks.values[i], value = link(i);

            if (config.duration) {
                merge(config, { composite: 'override' }); // optimize syntax?

                new Clip({ ...config, [prop]: value }).play(track, {});
            } else {
                track.apply(prop, value);
            }
        }
    }

    link(clip?: ClipProperties | Clip) {
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

        this.step();
    }

    unlink() {
        this.linked.forEach(unsubscribe => unsubscribe());
        this.linked = [];
    }

    transition(from: Timeline | undefined, options: TransitionOptions = {}) {

        for (let i = 0; i < this.tracks.size; i++) {

            this.tracks.values[i].transition(from?.tracks.values[i], options);
        }
    }

    insert(element: any) {
        if ((element instanceof HTMLElement || element instanceof SVGElement) && !this.tracks.has(element)) {
            const track = new Track(element, this.deform, this.cachable); // maybe use weakref?
            this.tracks.set(element, track);

            if (this.mounted) this.mountClips.forEach(clip => clip.play(track, {}));
        }
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0, commit }: PlayOptions) {

        for (let i = 0; i < this.tracks.size; i++) {
            if (immediate) this.tracks.values[i].clear();

            clip.play(this.tracks.values[i], {
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.size : 1) * Math.abs(this.stagger),
                composite,
                reverse,
                commit
            });
        }
    }

    pause() {
        for (const track of this.tracks.values) track.pause();
        this.paused = true;
    }

    play() {
        for (const track of this.tracks.values) track.play();
        this.paused = false;
    }

    cache() {
        for (const track of this.tracks.values) track.cache.update();
    }

}