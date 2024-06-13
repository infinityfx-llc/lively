import Clip, { AnimatableKey, ClipProperties } from "./clip";
import { TransitionOptions } from "./track";

type PartialCachableKey = Exclude<AnimatableKey, 'scale' | 'translate'>;
export type CachableKey = PartialCachableKey | 'x' | 'y' | 'sx' | 'sy'; // TEMP, should be merged with AnimatableKey eventually

type CacheData = {
    [key in PartialCachableKey]?: string;
} & {
    x: number;
    y: number;
    sx: number;
    sy: number;
};

export class StyleCache {

    element: HTMLElement | SVGElement;
    data: CacheData;
    computed: CSSStyleDeclaration;
    include: CachableKey[];

    constructor(element: HTMLElement | SVGElement, include: CachableKey[] = ['x', 'y', 'sx', 'sy', 'borderRadius', 'backgroundColor', 'color', 'rotate']) {
        this.element = element;
        this.include = include.map(key => key === 'strokeLength' ? 'strokeDashoffset' : key);
        this.computed = getComputedStyle(element);
        this.data = this.read();
    }

    read() {
        const data = {} as CacheData;

        // @ts-expect-error
        for (const prop of this.include) data[prop] = this.computed[prop];

        if (this.element instanceof SVGElement) return data;
        data.sx = this.element.offsetWidth;
        data.sy = this.element.offsetHeight;
        data.x = data.sx / 2;
        data.y = data.sy / 2;

        let parent: HTMLElement | null = this.element;
        while (parent) {
            data.x += parent.offsetLeft;
            data.y += parent.offsetTop;

            parent = parent.offsetParent as HTMLElement;
            if (parent?.dataset.livelyOffsetBoundary) break;
        }

        return data;
    }

    update() {
        this.data = this.read();
    }

    difference(from: CacheData = this.data, { duration = 0.5, easing = 'ease', reverse = false }: TransitionOptions) {
        const to = this.read(); // multiple simultanious transitions a problem?

        const scale = [[1, 1], [1, 1]],
            translate = [['0px', '0px'], ['0px', '0px']];
        const keyframes1: ClipProperties = { duration, easing, reverse, composite: 'combine' },
            keyframes2: ClipProperties = { ...keyframes1, composite: 'override' };

        for (const key of this.include) {
            switch (key) {
                case 'x':
                case 'y':
                    translate[0][key == 'x' ? 0 : 1] = from[key] - to[key] + 'px';
                    break;
                case 'sx':
                case 'sy':
                    scale[0][key == 'sx' ? 0 : 1] = to[key] === 0 ? 1 : from[key] / to[key];
                    break;
                default: keyframes2[key] = [from[key as never], to[key as never]];
            }
        }

        keyframes1.scale = scale.map(val => val.join(' '));
        keyframes1.translate = translate.map(val => val.join(' '));

        return [new Clip(keyframes1), new Clip(keyframes2)];
    }

}