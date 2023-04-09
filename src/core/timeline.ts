import type { Link } from "../hooks/use-link";
import Clip from "./clip";
import Track from "./track";

export default class Timeline {

    stagger: number;
    staggerLimit: number;
    deform: boolean;
    targets: HTMLElement[] = [];
    targetMap: { [key: number]: number | undefined } = {};
    tracks: Track[] = [];
    links: { [key: string]: Link<any> } = {};
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
        return clip.duration + this.stagger * Math.min(this.staggerLimit, this.targets.length - 1);
    }

    port(key: string, link: Link<any>, transition: number) { // merge with step()
        const val = link();

        for (const el of this.targets) {
            if (transition) {
                const animation = el.animate({ [key]: val }, { duration: transition * 1000, fill: 'both', easing: 'ease' }); // allow to change this easing
                animation.commitStyles();
            } else el.style[key as never] = val;
        }
    }

    insert(key: number, element: HTMLElement | null) {
        const idx = this.targetMap[key];

        if (element) {
            idx !== undefined ? this.targets[idx] = element : this.targetMap[key] = this.targets.push(element) - 1;
        } else
            if (idx !== undefined) {
                this.targets.splice(idx, 1);
                this.targetMap[key] = undefined;
            }

        this.frame = requestAnimationFrame(this.step.bind(this));
    }

    add(clip: Clip, { composite = false, immediate = false, reverse = false, delay = 0 } = {}) {

        for (let i = 0; i < this.targets.length; i++) {
            if (!this.tracks[i]) this.tracks[i] = new Track();

            const queued = this.tracks[i].active.length && !(composite || immediate);
            if (immediate) this.tracks[i].clear();

            const action = clip.play(this.targets[i], {
                deform: this.deform,
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.targets.length : this.stagger),
                composite,
                reverse,
                paused: !!queued
            });

            queued ? this.tracks[i].enqueue(action) : this.tracks[i].push(action);
        }
    }

    pause() {
        for (const track of this.tracks) track.pause();
    }

    play() {
        for (const track of this.tracks) track.play();
    }

}