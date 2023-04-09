import type { DynamicProperties } from "./clip";
import { lengthToOffset } from "./utils";

export default class Action {

    element: HTMLElement;
    computed: CSSStyleDeclaration;
    animation: Animation;
    dynamic: DynamicProperties;
    paused: boolean = false;
    deform: boolean = true;
    onfinish: (() => void) | null = null;

    constructor(element: HTMLElement, keyframes: Keyframe[] | PropertyIndexedKeyframes, config: KeyframeAnimationOptions, dynamic: DynamicProperties = {}) {
        this.element = element;
        this.computed = getComputedStyle(element);
        this.animation = element.animate(keyframes, config);
        this.animation.onfinish = () => {
            if (this.element.offsetParent !== null) this.animation.commitStyles();
            this.animation.cancel();
            this.onfinish?.();
        }

        this.dynamic = dynamic;
    }

    correct() {
        this.deform = false;
    }

    decomposeScale(val: string | number) {
        const [xString, yString] = val.toString().split(' ');

        let x = parseFloat(xString);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? parseFloat(yString) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    parseRadius() { // doesnt work with animating border radius currently
        if ('cachedBorderRadius' in this.element) return this.element.cachedBorderRadius as number;

        const [radius] = this.computed.borderRadius.toString().split(' ');
        return (this.element as any).cachedBorderRadius = parseFloat(radius) || 0;
    }

    step() {
        if (this.paused) return;

        const progress = this.animation.effect?.getComputedTiming().progress || 0;

        for (const key in this.dynamic) {
            const val = this.dynamic[key as keyof DynamicProperties]?.(progress);
            this.element.style[key as never] = key === 'strokeDashoffset' ? lengthToOffset(val) : val;
        }

        if (this.deform) return;

        const [x, y] = this.decomposeScale(this.computed.scale);
        const radius = this.parseRadius();

        this.element.style.borderRadius = `${radius / x}px / ${radius / y}px`;

        for (let i = 0; i < this.element.children.length; i++) {
            const child = this.element.children[i] as HTMLElement;

            child.style.transform = `scale(${1 / x}, ${1 / y})`;
        }
    }

    play() {
        this.animation.play();
        this.paused = false;
    }

    pause() {
        this.animation.pause();
        this.paused = true;
    }

    remove() {
        this.animation.cancel();
    }

}