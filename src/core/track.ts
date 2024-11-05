import type Action from "./action";
import { CachableKey, StyleCache } from "./cache";
import type { Easing } from "./clip";
import { lengthToOffset } from "./utils";

export type TransitionOptions = {
    duration?: number;
    easing?: Easing;
    reverse?: boolean;
};

export default class Track {

    element: HTMLElement | SVGElement; // use WeakRef??
    deform: boolean;
    playing: number = 0;
    active: Action[] = [];
    queue: Action[] = [];
    cache: StyleCache;
    paused: boolean = false;
    scale: [number, number] = [1, 1];
    corrected = {
        borderRadius: '',
        boxShadow: ''
    };

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

        if (!this.deform) {
            this.element.style.borderRadius = '';
            this.element.style.boxShadow = '';
            this.corrected.borderRadius = this.cache.data.borderRadius = this.cache.computed.borderRadius,
            this.corrected.boxShadow = this.cache.data.boxShadow = this.cache.computed.boxShadow;
            this.scale = [1, 1];
        }
    }

    pause(value: boolean) {
        for (const action of this.active) action.animation[value ? 'pause' : 'play']();

        this.paused = value;
    }

    step(index: number) {
        for (const action of this.active) action.step(index);

        if (!this.paused && this.active.length) this.correct();
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
    }

    decomposeScale(): [number, number] {
        const [xString, yString] = this.cache.computed.scale.split(' ');

        let x = Math.max(parseFloat(xString) || 1, .00001);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? Math.max(parseFloat(yString) || 1, .00001) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    correct() {
        if (this.deform) return;

        const computed = this.cache.computed;

        const radii = computed.borderRadius.split(/\s*\/\s*/);
        if (radii.length < 2) radii[1] = radii[0];
        const shadows = computed.boxShadow.split(/(?<=px),\s?/);
        const [color, shadow] = shadows[0].split(/(?<=\))\s/);

        const previousRadiusScale = computed.borderRadius !== this.corrected.borderRadius ? [1, 1] : this.scale;
        const previousShadowScale = computed.boxShadow !== this.corrected.boxShadow ? [1, 1] : this.scale;
        const [x, y] = this.scale = this.decomposeScale();

        this.element.style.borderRadius = radii.map((axis, i) => {
            return axis.split(' ').map(radius => {
                return parseFloat(radius) * previousRadiusScale[i] / this.scale[i] + (radius.match(/[^\d\.]+$/)?.[0] || 'px');
            }).join(' ');
        }).join('/');
        this.corrected.borderRadius = computed.borderRadius;

        if (shadow) {
            const props = shadow.split(' ').map(parseFloat),
                i = +(x < y),
                ms = i ? y : x,
                pms = Math.max(...previousShadowScale);

            const corrected: [number, number, number, number][] = new Array(3).fill([
                props[0] * previousShadowScale[0] / x,
                props[1] * previousShadowScale[1] / y,
                props[2] * pms / ms,
                props[3] * pms / ms
            ]);
            corrected[1][0] -= i ? 1 / x : 0;
            corrected[1][1] -= i ? 0 : 1 / y;
            corrected[2][0] += i ? 1 / x : 0;
            corrected[2][1] += i ? 0 : 1 / y;

            this.element.style.boxShadow = corrected.map(val => `${color} ${val.map(val => `${val}px`).join(' ')}`).join(', ');
            this.corrected.boxShadow = computed.boxShadow;
        }

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