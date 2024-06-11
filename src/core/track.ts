import type Action from "./action";
import { CachableKey, StyleCache } from "./cache";
import type { Easing } from "./clip";
import { lengthToOffset } from "./utils";

export type TransitionOptions = { duration?: number; easing?: Easing; reverse?: boolean; };

export default class Track {

    element: HTMLElement | SVGElement;
    deform: boolean;
    playing: number = 0;
    active: Action[] = [];
    queue: Action[] = [];
    cache: StyleCache;
    scale: [number, number] = [1, 1];
    paused: boolean = false;

    constructor(element: HTMLElement | SVGElement, deform: boolean, cachable?: CachableKey[]) {
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
            if (this.paused) action.animation.pause();
        }
    }

    next() {
        this.cache.update();

        if (--this.playing > 0) return;

        this.active = this.queue.length ? this.queue.splice(0, 1) : [];
        this.playing = this.active.length;
        this.pause(false);
    }

    clear(partial?: boolean) {
        this.active.forEach(action => {
            action.onfinish = null;

            try {
                if (!partial) {
                    action.animation.finish();
                } else
                    if (!action.commit && action.composite !== 'combine') {
                        action.animation.cancel();
                    }
            } catch (ex) {
                action.animation.cancel();
            }
        });

        if (!partial) {
            this.active = [];
            this.queue = [];
            this.playing = 0;
        }
        // also call correct here?? (manually set currentTime to desired frame to update)
    }

    pause(value: boolean) {
        for (const action of this.active) action.animation[value ? 'pause' : 'play']();

        this.paused = value;
    }

    step(index: number) {
        for (const action of this.active) action.step(index);

        if (this.active.length) this.correct();
    }

    transition(previous: Track | undefined, options: TransitionOptions) {
        this.clear(true);

        const clips = this.cache.difference(previous?.cache.data, options);
        this.cache.update();
        previous?.clear();
        previous?.cache.update();

        clips.forEach(clip => clip.play(this, { commit: false }));
    }

    apply(prop: string, val: any) { // update cache after this?
        const isStroke = prop === 'strokeLength';
        this.element.style[isStroke ? 'strokeDashoffset' : prop as never] = isStroke ? lengthToOffset(val) : val;
        // map borderRadius to something else to use in border radius correction?

        this.correct();
    }

    decomposeScale(): [number, number] {
        const [xString, yString] = this.cache.computed.scale.split(' ');

        let x = Math.max(parseFloat(xString) || 1, 0.0001);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? Math.max(parseFloat(yString), 0.0001) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    computeBorderRadius(borderRadius = this.cache.computed.borderRadius) { // doesnt work when border radius animates as well...
        const arr = borderRadius.split(/\s*\/\s*/);
        if (arr.length < 2) arr[1] = arr[0];

        const prev = this.scale;
        this.scale = this.decomposeScale();

        // if borderRadius animation (seperate attribute), dont use prev scale, just use scale directly

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
            const l = child.offsetLeft,
                t = child.offsetTop,
                w = child.offsetWidth,
                h = child.offsetHeight;

            const [tx, ty] = getComputedStyle(child).translate.split(' ').map(parseFloat);

            child.style.transform = `translate(${-tx || 0}px, ${-ty || 0}px) scale(${1 / x}, ${1 / y}) translate(${l * (1 - x) + w / 2 * (1 - x) + (tx || 0)}px, ${t * (1 - y) + h / 2 * (1 - y) + (ty || 0)}px)`;
        }
    }

}