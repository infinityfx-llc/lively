import { Easing } from "./clip2";

export type LinkValueOptions = {
    duration?: number;
    easing?: Easing;
};

export type LinkValueTransform<T, K> = (value: T, index?: number) => K;

export type LinkValueEvent = 'change';

export default class LinkValue<T, K = T> { // name just Link?

    value: T;
    options: LinkValueOptions = {};
    getWithIndex: (index: number) => K;
    eventListeners: {
        [key in LinkValueEvent]?: Set<(value: T) => void>;
    } = {};

    constructor(initial: T, getWithIndex?: (index: number) => K) {
        this.value = initial;
        this.getWithIndex = getWithIndex || (() => this.value) as any;
    }

    set(value: T, options: LinkValueOptions = {}) { // default duration?
        this.value = value;
        this.options = options;

        this.dispatch('change');
    }

    get(index = 0) {
        return [
            this.getWithIndex(index),
            this.options
        ] as const;
    }

    on(event: LinkValueEvent, callback: (value: T) => void) {
        if (!(event in this.eventListeners)) this.eventListeners[event] = new Set();

        this.eventListeners[event]!.add(callback);

        return () => {
            this.eventListeners[event]?.delete(callback);
        };
    }

    dispatch(event: LinkValueEvent) {
        this.eventListeners[event]?.forEach(callback => callback(this.value));
    }

}