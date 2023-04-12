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

    difference(from: CacheData = this.data) {
        const to = this.read();

        const keyframes: PropertyIndexedKeyframes[] = [
            {},
            {
                translate: [`${from.x - to.x}px ${from.y - to.y}px`, '0px 0px'],
                scale: [`${to.width === 0 ? 1 : from.width / to.width} ${to.height === 0 ? 1 : from.height / to.height}`, '1 1']
            }
        ];

        for (const key of ['borderRadius', 'backgroundColor', 'color', 'rotate', 'opacity']) { // these only need to be cached once or when they are explicitly animated (yes but might be fixed by .clear()/.finish() on transition)
            keyframes[0][key] = [from[key as never], to[key as never]]; // also return borderRadius as dynamic to correctly apply deform correction
        }

        return keyframes;
    }

}