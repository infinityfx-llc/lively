import type { Link } from "../hooks/use-link";
import Timeline from "./timeline";

type Easing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';
type CSSKeys = keyof React.CSSProperties; // add custom props (pathLength, x, y (pos), transform origin)
type AnimatableProperty = string | number | null | {
    set?: string | number;
    start?: string | number;
    end?: string | number;
    offset?: number;
};
type AnimatableProperties = { [key in CSSKeys]?: Link<any> | AnimatableProperty | AnimatableProperty[] };
type ClipConfig = {
    duration?: number;
    delay?: number;
    repeat?: number;
    alternate?: boolean;
    easing?: Easing;
};

export type ClipProperties = ClipConfig & AnimatableProperties;

export default class Clip {

    keyframes: Keyframe[];
    correction: { x: number, y: number, offset: number }[];
    initial: React.CSSProperties;
    duration: number;
    delay: number;
    repeat: number;
    alternate: boolean;
    easing: Easing;

    constructor({ duration = 1, delay = 0, repeat = 1, alternate = false, easing = 'ease', ...properties }: ClipProperties, initial: React.CSSProperties = {}) {
        const keyframes: {
            [key: number]: Keyframe;
        } = {};
        const correction: {
            [key: number]: { x: number, y: number, offset: number };
        } = {};

        for (const prop in properties) {
            const val = properties[prop as CSSKeys], init = initial[prop as CSSKeys];
            if (val instanceof Function) continue;

            const arr = Array.isArray(val) ? val : [val];

            if (arr.length < 2 && init !== undefined) arr.unshift(init);
            if (arr[0] === null) init !== undefined ? arr[0] = init : arr.splice(0, 1);

            for (let i = 0; i < arr.length; i++) {
                let [key, val] = this.parse(arr[i]);
                if (val === undefined) continue;

                if (key === null) key = arr.length < 2 ? 1 : Math.round(i / (arr.length - 1) * 1000) / 1000;
                if (!(key in keyframes)) keyframes[key] = { offset: key };

                if (prop === 'scale') {
                    const [x, y] = this.decomposeScale(val);
                    correction[key] = { offset: key, x, y };
                }

                keyframes[key][prop] = val;
            }
        }

        this.keyframes = Object.values(keyframes);
        this.correction = Object.values(correction); // account for different sized correction and keyframes arrays
        this.initial = initial;
        this.duration = duration;
        this.delay = delay;
        this.repeat = repeat;
        this.alternate = alternate;
        this.easing = easing;
    }

    parse(value: AnimatableProperty | undefined): [number | null, string | number | undefined] {
        if (value === null) return [null, undefined];

        if (typeof value === 'object') {
            return [value.offset || null, value.set]; // TODO start, end
        } else {
            return [null, value];
        }
    }

    decomposeScale(val: string | number) {
        const [xString, yString] = val.toString().split(' ');

        let x = parseFloat(xString);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? parseFloat(yString) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    parseRadius(keyframe: Keyframe, element: HTMLElement) {
        const br = keyframe.borderRadius ?? getComputedStyle(element).borderRadius;
        const [radius] = br.toString().split(' ');

        return parseFloat(radius) || 0;
    }

    static from(data?: ClipProperties | Clip, initial?: React.CSSProperties, timeline?: Timeline) {
        if (data !== undefined && !(data instanceof Clip) && timeline) {
            for (const key in data) {
                const val = data[key as keyof ClipProperties] as Link<any>;

                if (val instanceof Function) val.connect(timeline.port.bind(timeline, key, val));
            }
        }
        
        return data instanceof Clip ? data : new Clip({ ...data }, initial);
    }

    static transition(elements: HTMLElement[], keyframes: PropertyIndexedKeyframes[], duration = 0.5) {
        if (elements.length !== keyframes.length) return;

        for (let i = 0; i < elements.length; i++) {
            const animation = elements[i].animate(keyframes[i], {
                duration: duration * 1000,
                fill: 'both',
                easing: 'ease',
                composite: 'replace'
            });

            animation.commitStyles();
        }
    }

    unique(config: ClipConfig) {
        const clip = new Clip(config);
        clip.keyframes = this.keyframes;

        return clip;
    }

    play(element: HTMLElement, { composite = false, reverse = false, delay, deform = true, paused = false }: { composite?: boolean; reverse?: boolean; delay?: number; deform?: boolean; paused?: boolean; } = {}) {
        const config: KeyframeAnimationOptions = {
            duration: this.duration * 1000,
            delay: (delay || this.delay) * 1000,
            iterations: this.repeat,
            direction: this.alternate ?
                (reverse ? 'alternate-reverse' : 'alternate') :
                (reverse ? 'reverse' : 'normal'),
            fill: 'both',
            composite: composite ? 'add' : 'replace',
            easing: this.easing
        };
        let keyframes = this.keyframes;

        if (!deform && this.correction.length) {
            keyframes = new Array(keyframes.length);

            for (let i = 0; i < this.keyframes.length; i++) {
                const radius = this.parseRadius(this.keyframes[i], element);

                keyframes[i] = Object.assign({
                    borderRadius: `${radius / this.correction[i].x}px / ${radius / this.correction[i].y}px`
                }, this.keyframes[i]);
            }

            for (let i = 0; i < element.children.length; i++) {
                const animation = element.children[i].animate(this.correction.map(({ x, y, offset }) => ({
                    offset,
                    transform: `scale(${1 / x}, ${1 / y})`
                })), config);
                animation.commitStyles(); // maybe return these animation too (so they can be paused);
                if (paused) animation.pause();
            }
        }

        const animation = element.animate(keyframes, config);
        animation.commitStyles();
        if (paused) animation.pause();

        return animation;
    }

}