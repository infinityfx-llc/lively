import type { Link } from "../hooks/use-link";
import Clip from "./clip";

export default class Timeline {

    stagger: number;
    staggerLimit: number;
    deform: boolean;
    targets: HTMLElement[] = [];
    targetMap: { [key: number]: number | undefined } = {};
    tracks: Animation[][] = [];
    links: { [key: string]: Link<any> } = {};

    constructor({ stagger = 0.1, staggerLimit = 10, deform = true }) {
        this.stagger = stagger;
        this.staggerLimit = staggerLimit - 1;
        this.deform = deform;
    }

    time(clip: Clip) {
        return clip.duration + this.stagger * Math.min(this.staggerLimit, this.targets.length - 1);
    }

    port(key: string, link: Link<any>, transition: number) {
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
    }

    clear(trackIndex: number, id?: Animation) {
        const track = this.tracks[trackIndex];

        if (id) {
            const idx = track.findIndex(val => val === id);

            if (idx >= 0) track.splice(idx, 1);
            if (track[0]?.playState === 'paused') track[0].play();
        } else {
            track.forEach(animation => animation.cancel());
            this.tracks[trackIndex] = [];
        }
    }

    enqueue(clip: Clip, { composite = false, immediate = false, reverse = false, delay = 0 } = {}) {

        for (let i = 0; i < this.targets.length; i++) {
            if (!Array.isArray(this.tracks[i])) this.tracks[i] = [];

            const queued = this.tracks[i].length && !(composite || immediate);
            if (immediate) this.clear(i);

            const animation = clip.play(this.targets[i], {
                deform: this.deform,
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.targets.length : this.stagger),
                composite,
                reverse,
                paused: !!queued
            });
            this.tracks[i].push(animation);

            animation.onfinish = () => this.clear(i, animation);
        }
    }

    pause() {
        for (const track of this.tracks) {
            for (const animation of track) animation.pause();
        }
    }

    play() {
        for (const track of this.tracks) {
            track[0]?.play();
        }
    }

}