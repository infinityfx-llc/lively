import type { Link } from "../hooks/use-link";
import Clip, { AnimatableKey, ClipProperties, CompositeType, Easing } from "./clip";
import Track from "./track";
import { IndexedList } from "./utils";

export default class Timeline {

    index: number = 0;
    stagger: number;
    staggerLimit: number;
    deform: boolean;
    cachable?: AnimatableKey[];
    paused: boolean = false;
    tracks: IndexedList<Track> = new IndexedList();
    frame: number = 0;
    connected: boolean = false;
    mounted: boolean = false;
    test: boolean = false; // TEMP
    mountClips: Clip[];

    constructor({ stagger = 0.1, staggerLimit = 10, deform = true, cachable, mountClips }: { stagger?: number; staggerLimit?: number; deform?: boolean; cachable?: AnimatableKey[]; mountClips: Clip[]; }) {
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
        return clip.duration + this.stagger * Math.max(Math.min(this.staggerLimit, this.tracks.size - 1), 0);
    }

    port(key: string, link: Link<any>, transition: number) {
        if (this.paused) return;

        for (let i = 0; i < this.tracks.size; i++) {
            const val = link(i);

            if (transition) {
                new Clip({ duration: transition, easing: 'ease', [key]: val }).play(this.tracks.values[i], {});
            } else {
                this.tracks.values[i].apply(key, val);
            }
        }
    }

    connect(clip?: ClipProperties) {
        if (this.connected || !clip || clip instanceof Clip) return;

        for (let prop in clip) {
            const val = clip[prop as keyof ClipProperties];

            if (val instanceof Function && 'connect' in val) {
                val.connect(this.port.bind(this, prop, val));
                this.port(prop, val, 0);
            }
        }

        this.connected = true;
    }

    transition(from: Timeline | undefined, options: { duration?: number; easing?: Easing; } = {}) {

        for (let i = 0; i < this.tracks.size; i++) {

            this.tracks.values[i].transition(from?.tracks.values[i], options);
        }
    }

    insert(element: any) {
        if (!(element instanceof HTMLElement)) return;

        if (!('TRACK_INDEX' in element)) (element as any).TRACK_INDEX = this.index++;
        if (!this.tracks.has((element as any).TRACK_INDEX)) {
            const track = new Track(element, this.deform, this.cachable);
            this.tracks.add((element as any).TRACK_INDEX, track);

            if (this.mounted) this.mountClips.forEach(clip => clip.play(track, {}));
        }
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0, commit }: { immediate?: boolean; composite?: CompositeType; reverse?: boolean; delay?: number; commit?: boolean; }) {

        for (let i = 0; i < this.tracks.size; i++) {
            if (immediate) this.tracks.values[i].finish();

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