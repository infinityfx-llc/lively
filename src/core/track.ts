import Action, { ActionKeyframes } from "./action";
import { StyleCache } from "./cache";
import type { Easing } from "./clip";

export default class Track {

    element: HTMLElement;
    playing: number = 0;
    active: Action[] = [];
    queue: Action[] = [];
    onupdate: (() => void) | null = null;
    cache: StyleCache;

    constructor(element: HTMLElement) {
        this.element = element;
        this.cache = new StyleCache(element);
    }

    push(keyframes: ActionKeyframes | ActionKeyframes[], composite = false) {
        const action = new Action(this, keyframes);
        action.onfinish = this.next.bind(this);

        if (this.active.length && !composite) {
            this.queue.push(action);
            action.pause();
        } else {
            this.active.push(action);
            this.playing++;
        }

        return action;
    }

    next() {
        this.onupdate?.();
        this.cache.update();

        if (--this.playing > 0) return;

        this.active = this.queue.length ? this.queue.splice(0, 1) : [];
        this.playing = this.active.length;
        this.play();
    }

    clear() {
        this.active.forEach(action => action.remove());
        this.active = [];
        this.queue = [];
        this.playing = 0;
    }

    pause() {
        for (const action of this.active) action.pause();
    }

    play() {
        for (const action of this.active) action.play();
    }

    step(index: number) {
        for (const action of this.active) action.step(index);
    }

    transition(previous: Track | undefined, { duration, easing, deform }: { duration: number; easing: Easing; deform: boolean }) {
        const keyframes = this.cache.difference(previous?.cache.data);
        this.cache.update();
        previous?.cache.update();
        previous?.clear(); // maybe replace with .finish() for smoother morphs

        const action = this.push(keyframes.map((keyframes, i) => ({
            keyframes,
            config: {
                composite: i > 0 ? 'accumulate' : 'replace',
                duration: duration * 1000,
                fill: 'both',
                easing
            }
        })));
        if (!deform) action.correct();
    }

}