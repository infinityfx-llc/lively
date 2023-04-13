import Clip, { Easing } from "./clip";

type CacheData = {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius: string;
    opacity: string;
    backgroundColor: string;
    color: string;
    rotate: string;
};

export class StyleCache {

    element: HTMLElement;
    data: CacheData;
    computed: CSSStyleDeclaration;

    constructor(element: HTMLElement) {
        this.element = element;
        this.computed = getComputedStyle(element);
        this.data = this.read();
    }

    read() {
        const { x, y, width, height } = this.element.getBoundingClientRect();
        const { borderRadius, opacity, backgroundColor, color, rotate } = this.computed;

        return {
            x: x - window.scrollX,
            y: y + window.scrollY,
            width,
            height,
            borderRadius,
            opacity,
            backgroundColor,
            color,
            rotate
        };
    }

    update() {
        this.data = this.read();
    }

    difference(from: CacheData = this.data, { duration, easing }: { duration: number; easing: Easing; }) {
        const to = this.read();

        const keyframes: any = { duration, easing };
        for (const key of ['borderRadius', 'backgroundColor', 'color', 'rotate', 'opacity']) {
            keyframes[key] = [from[key as keyof CacheData], to[key as keyof CacheData]];
        }

        return [
            new Clip({
                translate: [`${from.x - to.x}px ${from.y - to.y}px`, '0px 0px'],
                scale: [`${to.width === 0 ? 1 : from.width / to.width} ${to.height === 0 ? 1 : from.height / to.height}`, '1 1'],
                composite: true,
                duration,
                easing
            }),
            new Clip(keyframes)
        ];
    }


}