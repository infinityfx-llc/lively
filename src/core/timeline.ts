import type { Link } from "../hooks/use-link";
import Clip, { Easing } from "./clip";
import Track from "./track";
import { IndexedList } from "./utils";

export default class Timeline {

    index: number = 0;
    stagger: number;
    staggerLimit: number;
    deform: boolean;
    paused: boolean = false;
    tracks: IndexedList<Track> = new IndexedList();
    frame: number = 0;

    constructor({ stagger = 0.1, staggerLimit = 10, deform = true }) {
        this.stagger = stagger;
        this.staggerLimit = staggerLimit - 1;
        this.deform = deform;
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
                const clip = new Clip({ duration: transition * 1000, easing: 'ease', [key]: val }); // check to optimize (no need to create new clip) (only for borderRadius dynamic function parsing/lengthToOffset)
                clip.play(this.tracks.values[i], {});
            } else {
                this.tracks.values[i].apply(key, val);
            }
        }
    }

    transition(from: Timeline | undefined, { duration = 0.5, easing = 'ease' }: { duration?: number; easing?: Easing } = {}) {

        for (let i = 0; i < this.tracks.size; i++) {

            this.tracks.values[i].transition(from?.tracks.values[i], { duration, easing });
        }
    }

    insert(element: HTMLElement | null) {
        if (!element) return;

        if (!('TRACK_INDEX' in element)) (element as any).TRACK_INDEX = this.index++;
        if (!this.tracks.has((element as any).TRACK_INDEX)) this.tracks.add((element as any).TRACK_INDEX, new Track(element, this.deform));

        // this.tracks.remove(key); // cancel animations when removing track
        // ^ detect when element.isConnected = false, then remove track
    }

    add(clip: Clip, { immediate = false, composite, reverse, delay = 0 }: { immediate?: boolean; composite?: boolean; reverse?: boolean; delay?: number }) {

        for (let i = 0; i < this.tracks.size; i++) {
            if (immediate) this.tracks.values[i].clear();

            clip.play(this.tracks.values[i], {
                delay: delay + Math.min(i, this.staggerLimit) * (this.stagger < 0 ? clip.duration / this.tracks.size : this.stagger),
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

}