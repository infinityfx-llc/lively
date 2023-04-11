import type { Link } from "../hooks/use-link";
import Action from "./action";
import StyleCache from "./cache";
import Clip, { Easing } from "./clip";
import Track from "./track";
import { IndexedList, lengthToOffset } from "./utils";

export default class Timeline {

    index: number = 0;
    stagger: number;
    staggerLimit: number;
    deform: boolean;
    paused: boolean = false;
    tracks: IndexedList<Track> = new IndexedList();
    cache: StyleCache = new StyleCache;
    frame: number = 0;

    constructor({ stagger = 0.1, staggerLimit = 10, deform = true }) {
        this.stagger = stagger;
        this.staggerLimit = staggerLimit - 1;
        this.deform = deform;
    }

    step() {
        cancelAnimationFrame(this.frame);

        this.tracks.forEach(track => track.step());

        this.frame = requestAnimationFrame(this.step.bind(this));
    }

    time(clip: Clip) {
        return clip.duration + this.stagger * Math.min(this.staggerLimit, this.tracks.size - 1);
    }

    port(key: string, link: Link<any>, transition: number) {
        if (this.paused) return;

        let val = link();
        if (key === 'strokeDashoffset') val = lengthToOffset(val);

        for (const track of this.tracks.values) {
            if (transition) {
                const action = new Action(track.element, { keyframes: { [key]: val }, config: { duration: transition * 1000, fill: 'both', easing: 'ease' } });
                if (this.deform) action.correct();
            } else track.element.style[key as never] = val;
        }
    }

    transition({ from, duration = 0.5, easing = 'ease' }: { from?: Timeline; duration?: number; easing?: Easing } = {}) {
        const to = this.cache.read(this.tracks.values);
        const fromData = from && this.cache.read(from.tracks.values);
        const keyframes = this.cache.computeDifference(to, from && from.cache.data);

        for (let i = 0; i < this.tracks.size; i++) {
            if (!keyframes[i].length) continue;

            const action = new Action(this.tracks.values[i].element, keyframes[i].map((keyframes, i) => ({
                keyframes,
                config: {
                    composite: i > 0 ? 'replace' : 'accumulate',
                    duration: duration * 1000,
                    fill: 'both',
                    easing
                }
            })));
            if (this.deform) action.correct();

            // this.tracks.get(i).push(action);
        }

        this.cache.set(to);
        if (fromData) from.cache.set(fromData); // FIX cache mutation from rapid morph updates
    }

    insert(element: HTMLElement | null) {
        if (!element) return;

        if (!('TRACK_INDEX' in element)) (element as any).TRACK_INDEX = this.index++;
        if (!this.tracks.has((element as any).TRACK_INDEX)) this.tracks.add((element as any).TRACK_INDEX, new Track(element));

        // this.tracks.remove(key); // cancel animations when removing track
        // ^ detect when element.isConnected = false, then remove track
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0 }: { immediate?: boolean; composite?: boolean; reverse?: boolean; delay?: number }) {
        if (composite === undefined) composite = clip.composite;
        if (reverse === undefined) reverse = clip.reverse;

        for (let i = 0; i < this.tracks.size; i++) {
            if (immediate) this.tracks.values[i].clear();

            const action = clip.play(this.tracks.values[i].element, {
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.size : this.stagger),
                deform: this.deform,
                composite,
                reverse
            });

            this.tracks.values[i].push(action, composite);
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

}