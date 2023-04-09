import type { Link } from "../hooks/use-link";
import Action from "./action";
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

                keyframes[key][prop] = val;
            }
        }

        this.keyframes = Object.values(keyframes);
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

    static from(data?: ClipProperties | Clip, initial?: React.CSSProperties, timeline?: Timeline) {
        if (data !== undefined && !(data instanceof Clip) && timeline) {
            for (const key in data) {
                const val = data[key as keyof ClipProperties] as Link<any>;

                if (val instanceof Function) val.connect(timeline.port.bind(timeline, key, val));
            }
        }

        return data instanceof Clip ? data : new Clip({ ...data }, initial);
    }

    unique(config: ClipConfig) {
        const clip = new Clip(config);
        clip.keyframes = this.keyframes;

        return clip;
    }

    play(element: HTMLElement, { composite = false, reverse = false, delay, deform = true, paused = false }: { composite?: boolean; reverse?: boolean; delay?: number; deform?: boolean; paused?: boolean; } = {}) {
        const action = new Action(element, this.keyframes, {
            duration: this.duration * 1000,
            delay: (delay || this.delay) * 1000,
            iterations: this.repeat,
            direction: this.alternate ?
                (reverse ? 'alternate-reverse' : 'alternate') :
                (reverse ? 'reverse' : 'normal'),
            fill: 'both',
            composite: composite ? 'add' : 'replace',
            easing: this.easing
        });
        if (!deform) action.correct();
        if (paused) action.pause();

        return action;
    }

}