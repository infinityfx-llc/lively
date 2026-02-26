import { AnimationOptions } from "./animator";

export type ClipConfig = {
    duration?: number;
    delay?: number;
    repeat?: number;
    alternate?: boolean;
    reverse?: boolean;
    easing?: any;
    composite?: any;
};

export default class Clip {

    isEmpty = false;
    duration: number;
    delay: number;
    repeat: number;
    alternate: boolean;
    reverse: boolean;
    easing: string;
    composite: any;

    constructor({
        duration = .5,
        delay = 0,
        repeat = 1,
        alternate = false,
        reverse = false,
        easing = 'ease',
        composite
    }: any, initial: any) {
        this.duration = duration;
        this.delay = delay;
        this.repeat = repeat;
        this.alternate = alternate;
        this.reverse = reverse;
        this.easing = easing;
        this.composite = composite;
        // ^ merge all the props into single object?
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
            directions: alternate ?
                (reverse ? 'alternate-reverse' : 'alternate') :
                (reverse ? 'reverse' : 'normal'),
            easing: this.easing,
            composite: composite === 'combine' ? 'accumulate' : 'replace',
            commit
        };
    }

}