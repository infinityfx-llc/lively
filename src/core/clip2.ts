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

}