import type { Link } from "../hooks/use-link";
import Action from "./action";
import Timeline from "./timeline";
import { lengthToOffset } from "./utils";

type Easing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';
type CSSKeys = keyof React.CSSProperties | 'pathLength';
type AnimatableProperty = string | number | null | {
    set?: string | number;
    start?: string | number;
    end?: string | number;
    offset?: number;
};
type AnimatableProperties = { [key in CSSKeys]?: Link<any> | ((progress: number) => any) | AnimatableProperty | AnimatableProperty[] };
type ClipConfig = {
    duration?: number;
    delay?: number;
    repeat?: number;
    alternate?: boolean;
    easing?: Easing;
    reverse?: boolean;
    composite?: boolean;
};

export type ClipProperties = ClipConfig & AnimatableProperties;

export type DynamicProperties = { [key in CSSKeys]?: (progress: number) => any };

export type AnimatableInitials = React.CSSProperties & { pathLength?: number | string };

export default class Clip {

    keyframes: Keyframe[];
    initial: React.CSSProperties;
    dynamic: DynamicProperties = {};
    duration: number;
    delay: number;
    repeat: number;
    alternate: boolean;
    easing: Easing;
    reverse: boolean;
    composite: boolean;

    constructor({ duration = 1, delay = 0, repeat = 1, alternate = false, easing = 'ease', reverse = false, composite = false, ...properties }: ClipProperties, initial: AnimatableInitials = {}) {
        const keyframes: {
            [key: number]: Keyframe;
        } = {};

        for (let prop in properties) {
            let val = properties[prop as CSSKeys], init = initial[prop as CSSKeys];
            prop = prop === 'pathLength' ? 'strokeDashoffset' : prop;

            if (val instanceof Function) {
                if (!('connect' in val)) this.dynamic[prop as CSSKeys] = val;
                continue;
            }

            const arr = Array.isArray(val) ? val : [val];

            if (arr.length < 2 && init !== undefined) arr.unshift(init);
            if (arr[0] === null) init !== undefined ? arr[0] = init : arr.splice(0, 1);

            for (let i = 0; i < arr.length; i++) {
                let [key, val] = this.parse(arr[i]);
                if (val === undefined) continue;

                if (key === null) key = arr.length < 2 ? 1 : Math.round(i / (arr.length - 1) * 1000) / 1000;
                if (!(key in keyframes)) keyframes[key] = { offset: key };

                keyframes[key][prop] = prop === 'strokeDashoffset' ? lengthToOffset(val) : val;
            }
        }

        if (initial.pathLength) initial.strokeDashoffset = lengthToOffset(initial.pathLength);

        this.keyframes = Object.values(keyframes);
        this.initial = initial;
        this.duration = duration;
        this.delay = delay;
        this.repeat = repeat;
        this.alternate = alternate;
        this.easing = easing;
        this.reverse = reverse;
        this.composite = composite;
    }

    parse(value: AnimatableProperty | undefined): [number | null, string | number | undefined] {
        if (value === null) return [null, undefined];

        if (typeof value === 'object') {
            return [value.offset || null, value.set]; // TODO start, end
        } else {
            return [null, value];
        }
    }

    static from(data?: ClipProperties | Clip, initial?: AnimatableInitials, timeline?: Timeline) {
        if (data !== undefined && !(data instanceof Clip) && timeline) {
            for (const key in data) {
                const val = data[key as keyof ClipProperties];

                if (val instanceof Function && 'connect' in val) val.connect(timeline.port.bind(timeline, key === 'pathLength' ? 'strokeDashoffset' : key, val));
            }
        }

        return data instanceof Clip ? data : new Clip({ ...data }, initial);
    }

    unique(config: ClipConfig) {
        const clip = new Clip(config);
        clip.keyframes = this.keyframes;

        return clip;
    }

    play(element: HTMLElement, { composite, reverse, delay, deform = true }: { composite: boolean; reverse: boolean; delay?: number; deform?: boolean; }) {
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
        }, this.dynamic);
        
        if (!deform) action.correct();

        return action;
    }

}