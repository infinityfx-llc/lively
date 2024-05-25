import { isLink, type Link } from "../hooks/use-link";
import { CachableKey } from "./cache";
import Clip, { ClipProperties, CompositeType } from "./clip";
import Track, { TransitionOptions } from "./track";
import { IndexedMap } from "./utils";

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
    connected: boolean = false;
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

    port(prop: string, link: Link<any>, dt: number) {
        if (this.paused) return;

        for (let i = 0; i < this.tracks.size; i++) {
            const track = this.tracks.values[i], value = link(i);

            if (dt) {
                new Clip({ duration: dt, easing: 'ease', [prop]: value }).play(track, { composite: 'override' }); // should maybe combine for translate/scale (also be able to override manually?)
            } else {
                track.apply(prop, value);
            }
        }
    }

    connect(clip?: ClipProperties | Clip) {
        this.step();

        if (this.connected || !clip || clip instanceof Clip) return;

        for (let prop in clip) {
            const val = clip[prop as keyof ClipProperties];

            if (isLink(val)) {
                val.onchange(this.port.bind(this, prop, val));

                this.port(prop, val, 0);
            }
        }

        this.connected = true;
    }

    transition(from: Timeline | undefined, options: TransitionOptions = {}) {

        for (let i = 0; i < this.tracks.size; i++) {

            this.tracks.values[i].transition(from?.tracks.values[i], options);
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