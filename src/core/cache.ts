import Clip, { AnimatableKey, ClipProperties, Easing } from "./clip";

type CacheData = { [key in AnimatableKey]?: string } & {
    _x: number;
    _y: number;
    _w: number;
    _h: number;
};

export class StyleCache {

    element: HTMLElement;
    data: CacheData;
    computed: CSSStyleDeclaration;
    include: AnimatableKey[]; // doesnt work with strokeLength

    constructor(element: HTMLElement, include: AnimatableKey[] = ['translate', 'scale', 'borderRadius', 'backgroundColor', 'color', 'rotate', 'opacity']) {
        this.element = element;
        this.include = include;
        this.computed = getComputedStyle(element);
        this.data = this.read();
    }

    read() {
        const data: CacheData = { _x: 0, _y: 0, _w: this.element.offsetWidth, _h: this.element.offsetHeight };
        // const offset = getComputedStyle(this.element).transform.match(/(-?\d+),\s(-?\d+)\)/)?.slice(1, 3).map(val => parseInt(val)) || [0, 0];
        // data._x += data._w / 2 + offset[0];
        // data._y += data._h / 2 + offset[1];
        data._x += data._w / 2;
        data._y += data._h / 2;
        
        let parent: HTMLElement | null = this.element;
        while (parent) {
            data._x += parent.offsetLeft;
            data._y += parent.offsetTop;

            parent = parent.offsetParent as HTMLElement;
        }

        for (const prop of this.include) data[prop] = this.computed[prop as never];

        return data;
    }

    update() {
        this.data = this.read();
    }

    difference(from: CacheData = this.data, { duration = 0.5, easing = 'ease' }: { duration?: number; easing?: Easing; }) {
        const to = this.read();

        const keyframes1: ClipProperties = { duration, easing, composite: 'combine' }, keyframes2: ClipProperties = { duration, easing, composite: 'override' };
        for (const key of this.include) {
            switch (key) {
                case 'scale': keyframes1[key] = [`${to._w === 0 ? 1 : from._w / to._w} ${to._h === 0 ? 1 : from._h / to._h}`, '1 1'];
                    break;
                case 'translate': keyframes1[key] = [`${from._x - to._x}px ${from._y - to._y}px`, '0px 0px'];
                    break;
                default: keyframes2[key] = [from[key as never], to[key as never]];
            }
        }

        return [new Clip(keyframes1), new Clip(keyframes2)];
    }

}