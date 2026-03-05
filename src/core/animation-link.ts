import { Easing } from "./clip2";

export type AnimationLinkOptions = {
    duration?: number;
    easing?: Easing;
};

export type AnimationLinkEvent = 'change'; // if only event rename on to onChange

export default class AnimationLink<T, K = T> {

    value: T;
    options: AnimationLinkOptions = {};
    getWithIndex: (index: number) => K;
    eventListeners: {
        [key in AnimationLinkEvent]?: Set<(value: T) => void>;
    } = {};

    constructor(initial: T, getWithIndex?: (index: number) => K) {
        this.value = initial;
        this.getWithIndex = getWithIndex || (() => this.value) as any;
    }

    set(value: T, options: AnimationLinkOptions = {}) {
        this.value = value;
        this.options = options;

        this.dispatch('change');
    }

    get(index = 0) {
        return this.getWithIndex(index);
    }

    on(event: AnimationLinkEvent, callback: (value: T) => void) {
        if (!(event in this.eventListeners)) this.eventListeners[event] = new Set();

        this.eventListeners[event]!.add(callback);

        return () => {
            this.eventListeners[event]?.delete(callback);
        };
    }

    dispatch(event: AnimationLinkEvent) {
        this.eventListeners[event]?.forEach(callback => callback(this.value));
    }

}