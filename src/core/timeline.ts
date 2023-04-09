import type { Link } from "../hooks/use-link";
import Action from "./action";
import StyleCache from "./cache";
import Clip from "./clip";
import Track from "./track";
import { lengthToOffset } from "./utils";

export default class Timeline {

    stagger: number;
    staggerLimit: number;
    deform: boolean;
    paused: boolean = false;
    trackMap: { [key: number]: number | undefined } = {};
    tracks: Track[] = [];
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
        return clip.duration + this.stagger * Math.min(this.staggerLimit, this.tracks.length - 1);
    }

    port(key: string, link: Link<any>, transition: number) {
        if (this.paused) return;

        let val = link();
        if (key === 'strokeDashoffset') val = lengthToOffset(val);

        for (const track of this.tracks) {
            if (transition) {
                const action = new Action(track.element, { [key]: val }, { duration: transition * 1000, fill: 'both', easing: 'ease' });
                if (this.deform) action.correct();
            } else track.element.style[key as never] = val;
        }
    }

    transition(duration = 0.5) {
        if (this.paused) return;

        const data = this.cache.read(this.tracks);
        const keyframes = this.cache.computeDifference(data);

        for (let i = 0; i < this.tracks.length; i++) {
            const action = new Action(this.tracks[i].element, keyframes[i], {
                duration: duration * 1000,
                fill: 'both',
                easing: 'ease',
                composite: 'add'
            });
            if (this.deform) action.correct();
        }

        this.cache.set(data);
    }

    insert(key: number, element: HTMLElement | null) {
        const idx = this.trackMap[key];

        if (element) {
            if (idx !== undefined) {
                this.tracks[idx].element = element;
            } else {
                const idx = this.tracks.push(new Track(element)) - 1;
                this.trackMap[key] = idx;
                this.tracks[idx].onupdate = () => {
                    const track = this.tracks[idx];
                    if (track) this.cache.update(idx, track.element);
                }
            }
        } else
            if (idx !== undefined) {
                this.tracks.splice(idx, 1);
                this.trackMap[key] = undefined;
            }

        this.frame = requestAnimationFrame(this.step.bind(this));
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0 }: { immediate?: boolean; composite?: boolean; reverse?: boolean; delay?: number }) {
        if (composite === undefined) composite = clip.composite;
        if (reverse === undefined) reverse = clip.reverse;

        for (let i = 0; i < this.tracks.length; i++) {

            const queued = this.tracks[i].active.length && !(composite || immediate);
            if (immediate) this.tracks[i].clear();

            const action = clip.play(this.tracks[i].element, {
                deform: this.deform,
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.length : this.stagger),
                composite,
                reverse
            });
            if (queued) action.pause();

            queued ? this.tracks[i].enqueue(action) : this.tracks[i].push(action);
        }
    }

    pause() {
        for (const track of this.tracks) track.pause();
        this.paused = true;
    }

    play() {
        for (const track of this.tracks) track.play();
        this.paused = false;
    }

}