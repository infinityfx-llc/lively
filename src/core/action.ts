import type { DynamicProperties } from "./clip";
import { lengthToOffset } from "./utils";

type ActionKeyframes = { keyframes: Keyframe[] | PropertyIndexedKeyframes; config?: KeyframeAnimationOptions; dynamic?: DynamicProperties };

export default class Action {

    element: HTMLElement;
    computed: CSSStyleDeclaration;
    animations: Animation[];
    dynamic: DynamicProperties = {};
    paused: boolean = false;
    deform: boolean = true;
    onfinish: (() => void) | null = null;

    constructor(element: HTMLElement, keyframes: ActionKeyframes | ActionKeyframes[]) {
        if (!Array.isArray(keyframes)) keyframes = [keyframes];

        this.element = element;
        this.computed = getComputedStyle(element);

        this.animations = keyframes.map(({ keyframes, config, dynamic }) => {
            if (dynamic) this.dynamic = dynamic;

            return element.animate(keyframes, config);
        });

        this.animations[0].onfinish = this.finish.bind(this);
    }

    finish() {
        for (const animation of this.animations) {
            if (this.element.offsetParent !== null) animation.commitStyles();
            animation.cancel();
        }

        this.onfinish?.();
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

        const progress = this.animations[0].effect?.getComputedTiming().progress || 0;

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
        this.animations.forEach(animation => animation.play());
        this.paused = false;
    }

    pause() {
        this.animations.forEach(animation => animation.pause());
        this.paused = true;
    }

    remove() {
        this.animations.forEach(animation => animation.cancel());
    }

}