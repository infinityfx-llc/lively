import type { Link } from "../hooks/use-link";
import Action from "./action";
import Timeline from "./timeline";
import type Track from "./track";
import { createDynamicFrom, distributeAnimatableKeyframes, normalizeAnimatableKeyframes } from "./utils";

export type Easing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';

type CSSKeys = keyof React.CSSProperties | 'pathLength';

export type AnimatableProperty = string | number | null | {
    value?: string | number;
    after?: string | number;
    offset?: number;
};

type AnimatableProperties = { [key in CSSKeys]?: Link<any> | ((progress: number, index: number) => any) | AnimatableProperty | AnimatableProperty[] };
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

export type DynamicProperties = { [key in CSSKeys]?: (progress: number, index: number) => any };

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
    isEmpty: boolean;

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

            if (!normalizeAnimatableKeyframes(arr)) continue;

            if (prop === 'borderRadius') {
                this.dynamic[prop as CSSKeys] = createDynamicFrom(prop, arr as any, easing);
                continue;
            }

            distributeAnimatableKeyframes(prop, arr as any, keyframes);
        }

        this.keyframes = Object.values(keyframes);

        initial = this.keyframes.length > 1 ? (this.keyframes[0] as any) : initial;
        delete initial.offset;

        this.initial = initial;
        this.duration = duration;
        this.delay = delay;
        this.repeat = repeat;
        this.alternate = alternate;
        this.easing = easing;
        this.reverse = reverse;
        this.composite = composite;
        this.isEmpty = !this.keyframes.length && !Object.keys(this.dynamic).length;
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
        const clip = new Clip({});

        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                (clip as any)[key] = key in config ? config[key as never] : this[key];
            }
        }

        return clip;
    }

    play(track: Track, { composite = this.composite, reverse = this.reverse, delay }: { composite?: boolean; reverse?: boolean; delay?: number; }) {
        if (this.isEmpty) return;

        const action = new Action(track, this.keyframes, {
            duration: this.duration * 1000,
            delay: (delay || this.delay) * 1000,
            iterations: this.repeat,
            direction: this.alternate ?
                (reverse ? 'alternate-reverse' : 'alternate') :
                (reverse ? 'reverse' : 'normal'),
            composite: composite ? 'accumulate' : 'replace',
            fill: 'both',
            easing: this.easing
        }, this.dynamic);

        track.push(action);
    }

}