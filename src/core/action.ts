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

    decomposeScale() {
        const [xString, yString] = this.computed.scale.split(' ');

        let x = Math.max(parseFloat(xString) || 1, 0.0001);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? Math.max(parseFloat(yString), 0.0001) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    computeBorderRadius(value: string) {
        const arr = value.toString().split(' '); // allow for multiple values (corners)
        const radius = parseFloat(arr[0]) || 0;
        const [x, y] = this.deform ? [1, 1] : this.decomposeScale();

        return `${radius / x}px / ${radius / y}px`;
    }

    step(index: number) {
        if (this.paused) return;

        const progress = this.animations[0].effect?.getComputedTiming().progress || 0;

        // if (!('cachedBorderRadius' in this.element)) (this.element as any).cachedBorderRadius = this.computed.borderRadius;
        // let borderRadius = (this.element as any).cachedBorderRadius;

        for (const key in this.dynamic) {
            const val = this.dynamic[key as keyof DynamicProperties]?.(progress, index);

            // if (key === 'borderRadius') { // also in links (doesnt works with individual styles yet (borderTopLeft, etc...))
            //     borderRadius = val;
            //     continue;
            // }

            this.element.style[key as never] = key === 'strokeDashoffset' ? lengthToOffset(val) : val;
        }

        // this.element.style.borderRadius = this.computeBorderRadius(borderRadius);

        if (this.deform) return;

        const [x, y] = this.decomposeScale();

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