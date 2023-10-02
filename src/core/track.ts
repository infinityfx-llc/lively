import type Action from "./action";
import { StyleCache } from "./cache";
import type { AnimatableKey, Easing } from "./clip";
import { lengthToOffset } from "./utils";

export type TransitionOptions = { duration?: number; easing?: Easing; reverse?: boolean; };

export default class Track {

    element: HTMLElement;
    deform: boolean;
    playing: number = 0;
    active: Action[] = [];
    queue: Action[] = [];
    onupdate: (() => void) | null = null;
    cache: StyleCache;
    scale: [number, number] = [1, 1];

    constructor(element: HTMLElement, deform: boolean, cachable?: AnimatableKey[]) {
        this.element = element;
        this.deform = deform;
        this.cache = new StyleCache(element, cachable);
    }

    push(action: Action) {
        action.onfinish = this.next.bind(this);

        if (this.playing && action.composite === 'none') {
            this.queue.push(action);
            action.animation.pause();
        } else {
            this.active.push(action);
            if (action.composite === 'none') this.playing++;
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

    finish() {
        this.active.forEach(action => {
            action.onfinish = null;

            try {
                action.animation.finish();
            } catch (ex) {
                action.animation.cancel();
            }
        });
        this.active = [];
        this.queue = [];
        this.playing = 0;
        // also call correct here?? (manually set currentTime to desired frame to update)
    }

    pause() {
        for (const action of this.active) action.animation.pause();
    }

    play() {
        for (const action of this.active) action.animation.play();
    }

    step(index: number) {
        for (const action of this.active) action.step(index);

        if (this.active.length) this.correct();
    }

    transition(previous: Track | undefined, options: TransitionOptions) {
        const clips = this.cache.difference(previous?.cache.data, options);
        this.cache.update();
        previous?.finish();
        previous?.cache.update();

        clips.forEach(clip => clip.play(this, { commit: false }));
    }

    apply(prop: string, val: any) { // update cache after this?
        this.set(prop, val);
        this.correct();
    }

    set(prop: string, val: any) {
        prop = prop === 'strokeLength' ? 'strokeDashoffset' : prop;

        this.element.style[prop as never] = prop === 'strokeDashoffset' ? lengthToOffset(val) : val;
    }

    decomposeScale(): [number, number] {
        const [xString, yString] = this.cache.computed.scale.split(' ');

        let x = Math.max(parseFloat(xString) || 1, 0.0001);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? Math.max(parseFloat(yString), 0.0001) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    computeBorderRadius(borderRadius = this.cache.computed.borderRadius) {
        const arr = borderRadius.split(/\s*\/\s*/);
        if (arr.length < 2) arr[1] = arr[0];

        const prev = this.scale;
        this.scale = this.decomposeScale();

        return arr.map((axis, i) => {
            return axis.split(' ').map(val => {
                return parseFloat(val) * prev[i] / this.scale[i] + (val.match(/[^\d\.]+$/)?.[0] || 'px');
            }).join(' ');
        }).join('/');
    }

    correct() {
        if (this.deform) return;

        this.element.style.borderRadius = this.computeBorderRadius();
        const [x, y] = this.decomposeScale();

        for (let i = 0; i < this.element.children.length; i++) {
            const child = this.element.children[i] as HTMLElement;

            child.style.transform = `scale(${1 / x}, ${1 / y})`;
        }
    }

}