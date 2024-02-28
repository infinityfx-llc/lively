import { isLink, type Link } from "../hooks/use-link";
import Action from "./action";
import type Track from "./track";
import { distributeAnimatableKeyframes, merge, normalizeAnimatableKeyframes } from "./utils";

export type Easing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | 'exp-spring';

export type AnimatableKey = keyof React.CSSProperties | 'strokeLength';

export type AnimatableKeyframe = string | number | null | {
    value?: string | number;
    after?: string | number;
    offset?: number;
    // easing?: Easing;
};

type AnimatableProperties = { [key in AnimatableKey]?: Link<any> | ((progress: number, index: number) => any) | AnimatableKeyframe | AnimatableKeyframe[] };

export type AnimatableInitials = React.CSSProperties & { strokeLength?: number | string };

export type CompositeType = 'none' | 'override' | 'combine';

type ClipConfig = {
    duration?: number;
    delay?: number;
    repeat?: number;
    alternate?: boolean;
    easing?: Easing;
    reverse?: boolean;
    composite?: CompositeType;
};

export type ClipProperties = ClipConfig & AnimatableProperties;

export type DynamicProperties = { [key in AnimatableKey]?: (progress: number, index: number) => any };

export default class Clip {

    keyframes: Keyframe[];
    initial: React.CSSProperties;
    dynamic: DynamicProperties = {};
    duration: number;
    delay: number;
    repeat: number;
    alternate: boolean;
    easing: string;
    reverse: boolean;
    composite: CompositeType;
    isEmpty: boolean;

    constructor({ duration = 1, delay = 0, repeat = 1, alternate = false, easing = 'ease', reverse = false, composite = 'none', ...properties }: ClipProperties, initial: AnimatableInitials = {}) {
        const keyframes: {
            [key: number]: Keyframe;
        } = {};

        for (let prop in properties) {
            let val = properties[prop as AnimatableKey], init = initial[prop as AnimatableKey];
            prop = prop === 'strokeLength' ? 'strokeDashoffset' : prop;

            if (val instanceof Function) {
                if (!isLink(val)) this.dynamic[prop as AnimatableKey] = val;
                continue;
            }

            const arr = Array.isArray(val) ? val : [val];

            if (arr.length < 2 && init !== undefined) arr.unshift(init);
            if (arr[0] === null) init !== undefined ? arr[0] = init : arr.splice(0, 1);

            if (!normalizeAnimatableKeyframes(arr)) continue;

            distributeAnimatableKeyframes(prop, arr as any, keyframes);
        }

        this.keyframes = Object.values(keyframes);
        this.initial = merge([], {}, initial, this.keyframes.length ? (this.keyframes[0] as any) : {});
        // this.initial.strokeDashoffset = lengthToOffset((this.initial as any).strokeLength);
        delete this.initial.offset;
        this.isEmpty = !this.keyframes.length && !Object.keys(this.dynamic).length;
        this.duration = this.isEmpty ? 0 : duration;
        this.delay = delay;
        this.repeat = repeat;
        this.alternate = alternate;
        this.easing = easing === 'exp-spring' ? 'linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1)' : easing;
        this.reverse = reverse;
        this.composite = composite;
    }

    static from(data?: ClipProperties | Clip, initial?: AnimatableInitials) {
        return data instanceof Clip ? data : new Clip(data || {}, initial);
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

    play(track: Track, { composite = this.composite, reverse = this.reverse, commit = true, delay = 0 }: { composite?: CompositeType; reverse?: boolean; delay?: number; commit?: boolean; }) {
        if (this.isEmpty) return;

        const action = new Action(track, this.keyframes, {
            duration: this.duration * 1000,
            delay: (delay + this.delay) * 1000,
            iterations: this.repeat,
            direction: this.alternate ?
                (reverse ? 'alternate-reverse' : 'alternate') :
                (reverse ? 'reverse' : 'normal'),
            fill: 'both',
            easing: this.easing,
            composite
        }, this.dynamic);
        
        action.commit = commit;

        track.push(action);
    }

}