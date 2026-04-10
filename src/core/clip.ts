import { AnimationOptions } from "./animator";
import AnimationLink from "./animation-link";
import { parseClipKeyframes } from "./utils";

export type BlendMode = 'none' | 'override' | 'combine';

export type Easing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | (string & {});

export type ClipConfig = {
    duration?: number;
    delay?: number;
    repeat?: number;
    alternate?: boolean;
    reverse?: boolean;
    easing?: Easing;
    composite?: BlendMode;
};

export type ClipKey = keyof React.CSSProperties | 'strokeLength';

export type ClipKeyframe = null | string | number | {
    to?: string | number;
    after?: string | number;
    offset?: number;
};

export type ClipKeyframes = {
    [key in ClipKey]?: ClipKeyframe | ClipKeyframe[] | AnimationLink<any>;
};

export type ClipOptions = ClipConfig & ClipKeyframes;

export type ClipInitials = React.CSSProperties & {
    strokeLength?: number;
};

export default class Clip {

    isEmpty: boolean;
    keyframes: Keyframe[];
    duration: number;
    delay: number;
    repeat: number;
    alternate: boolean;
    reverse: boolean;
    easing: Easing;
    composite: BlendMode;

    constructor({
        duration = .5,
        delay = 0,
        repeat = 1,
        alternate = false,
        reverse = false,
        easing = 'ease',
        composite = 'none',
        ...keyframes
    }: ClipOptions, initial: ClipInitials = {}) {
        this.duration = duration;
        this.delay = delay;
        this.repeat = repeat;
        this.alternate = alternate;
        this.reverse = reverse;
        this.easing = easing;
        this.composite = composite;

        this.keyframes = parseClipKeyframes(keyframes, initial);
        this.isEmpty = !this.keyframes.length;
    }

    getConfig({
        delay = 0,
        repeat = this.repeat,
        alternate = this.alternate,
        reverse = this.reverse,
        composite = this.composite,
        commit = true
    }: AnimationOptions) {

        return {
            duration: this.duration * 1000,
            delay: (this.delay + delay) * 1000,
            iterations: repeat,
            direction: alternate ?
                (reverse ? 'alternate-reverse' as const : 'alternate' as const) :
                (reverse ? 'reverse' as const : 'normal' as const),
            easing: this.easing,
            composite: composite === 'combine' ? 'accumulate' as const : 'replace' as const,
            fill: 'both' as const,
            blendmode: composite,
            commit
        };
    }

}