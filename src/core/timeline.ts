import type { Link } from "../hooks/use-link";
import Clip, { AnimatableKey, ClipProperties, Easing } from "./clip";
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

    constructor({ stagger = 0.1, staggerLimit = 10, deform = true, cachable }: { stagger?: number; staggerLimit?: number; deform?: boolean; cachable?: AnimatableKey[] }) {
        this.stagger = stagger;
        this.staggerLimit = staggerLimit - 1;
        this.deform = deform;
        this.cachable = cachable;
    }

    step() {
        cancelAnimationFrame(this.frame);

        this.tracks.forEach((track, i) => track.step(i));

        this.frame = requestAnimationFrame(this.step.bind(this));
    }

    time(clip: Clip) {
        return clip.duration + this.stagger * Math.min(this.staggerLimit, this.tracks.size - 1);
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

    insert(element: HTMLElement | null) {
        if (!element) return;

        if (!('TRACK_INDEX' in element)) (element as any).TRACK_INDEX = this.index++;
        if (!this.tracks.has((element as any).TRACK_INDEX)) {
            const track = new Track(element, this.deform, this.cachable);
            this.tracks.add((element as any).TRACK_INDEX, track);

            track.onremove = () => this.tracks.remove((element as any).TRACK_INDEX);
        }
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0 }: { immediate?: boolean; composite?: boolean; reverse?: boolean; delay?: number }) {

        for (let i = 0; i < this.tracks.size; i++) {
            if (immediate) this.tracks.values[i].finish();

            clip.play(this.tracks.values[i], {
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.size : 1) * Math.abs(this.stagger),
                composite,
                reverse
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