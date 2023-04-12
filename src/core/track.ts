import Action, { ActionKeyframes } from "./action";
import { StyleCache } from "./cache";
import type { Easing } from "./clip";
import { lengthToOffset } from "./utils";

export default class Track {

    element: HTMLElement;
    deform: boolean;
    playing: number = 0;
    active: Action[] = [];
    queue: Action[] = [];
    onupdate: (() => void) | null = null;
    cache: StyleCache;
    scaleDelta: [number, number] = [1, 1];

    constructor(element: HTMLElement, deform: boolean) {
        this.element = element;
        this.deform = deform;
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

    transition(previous: Track | undefined, { duration, easing }: { duration: number; easing: Easing; }) {
        const keyframes = this.cache.difference(previous?.cache.data);
        this.cache.update();
        previous?.cache.update();
        previous?.clear(); // maybe replace with .finish() for smoother morphs (or composite with current animation, but not for morphs)

        this.push(keyframes.map((keyframes, i) => ({
            keyframes,
            config: {
                composite: i > 0 ? 'accumulate' : 'replace',
                duration: duration * 1000,
                fill: 'both',
                easing
            }
        })));
    }

    apply(prop: string, val: any) {
        this.set(prop, val);
        this.correct();
    }

    set(prop: string, val: any) {
        if (prop === 'borderRadius') val = this.computeBorderRadius(val);

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
        if (this.deform) return borderRadius;
        
        const [_, xString, yString] = borderRadius.match(/([\d\.]+)(?:.*\/.*?([\d\.]+))?/) || ['', '0', '0'];
        const xr = parseFloat(xString) * this.scaleDelta[0];
        const yr = yString ? parseFloat(yString) * this.scaleDelta[1] : xr;

        this.scaleDelta = this.decomposeScale();
        // not working with percentages or individual corner based styles

        return `${xr / this.scaleDelta[0]}px / ${yr / this.scaleDelta[1]}px`;
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