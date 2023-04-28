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
        const { x, y, width, height } = this.element.getBoundingClientRect();
        const data: CacheData = { _x: x + width / 2 - window.scrollX, _y: y + height / 2 + window.scrollY, _w: width, _h: height };

        for (const prop of this.include) data[prop] = this.computed[prop as never];

        return data;
    }

    update() {
        this.data = this.read();
    }

    difference(from: CacheData = this.data, { duration = 0.5, easing = 'ease' }: { duration?: number; easing?: Easing; }) {
        const to = this.read();

        const keyframes1: ClipProperties = { duration, easing, composite: true }, keyframes2: ClipProperties = { duration, easing };
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