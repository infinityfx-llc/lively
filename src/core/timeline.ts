import type { Link } from "../hooks/use-link";
import Action from "./action";
import StyleCache from "./cache";
import Clip from "./clip";
import Track from "./track";
import { IndexedList, lengthToOffset } from "./utils";

export default class Timeline {

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
                const action = new Action(track.element, { [key]: val }, { duration: transition * 1000, fill: 'both', easing: 'ease' });
                if (this.deform) action.correct();
            } else track.element.style[key as never] = val;
        }
    }

    transition(duration = 0.5) {
        if (this.paused) return;

        const data = this.cache.read(this.tracks.values);
        const keyframes = this.cache.computeDifference(data);

        for (let i = 0; i < this.tracks.size; i++) {
            const action = new Action(this.tracks.get(i).element, keyframes[i], {
                duration: duration * 1000,
                fill: 'both',
                easing: 'ease',
                composite: 'add'
            });
            if (this.deform) action.correct();

            // push to track instead?? (so can be paused)
        }

        this.cache.set(data);
    }

    insert(key: number, element: HTMLElement | null) { // OPTIMIZE
        element ? this.tracks.add(key, new Track(element)) : this.tracks.remove(key);
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0 }: { immediate?: boolean; composite?: boolean; reverse?: boolean; delay?: number }) {
        if (composite === undefined) composite = clip.composite;
        if (reverse === undefined) reverse = clip.reverse;

        for (let i = 0; i < this.tracks.size; i++) {

            const queued = this.tracks.get(i).active.length && !(composite || immediate);
            if (immediate) this.tracks.get(i).clear();

            const action = clip.play(this.tracks.get(i).element, {
                deform: this.deform,
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.size : this.stagger),
                composite,
                reverse
            });
            if (queued) action.pause();

            queued ? this.tracks.get(i).enqueue(action) : this.tracks.get(i).push(action);
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