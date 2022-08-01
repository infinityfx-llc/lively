import { ANIMATION_PROPERTIES } from './globals';
import { sanitize } from './utils/convert';
import { interpolateProperty } from './utils/interpolate';
import AnimationQueue from './queue';
import Keyframe from './keyframe';

export default class Animation { //rename to animationclip

    constructor({ delay = 0, duration = 1, repeat = 1, ...properties } = {}, initial = {}) {
        this.length = 0;
        this.delay = delay;
        this.duration = duration;
        this.repeat = repeat;

        this.keyframes = this.parse(properties, initial);
    }

    initial(element, keyframe = this.keyframes[0]) {
        if (!keyframe) return;
        keyframe.initial(element);
    }

    restore(element, fallback = false) {
        if (fallback || element.Lively?.keyframe) this.initial(element, element.Lively?.keyframe);
    }

    parse(properties, initial) {
        const { interpolate, origin, useLayout, ...props } = properties; //OPTIMIZE

        for (const prop in props) {
            if (!Array.isArray(props[prop])) props[prop] = [props[prop]];
            if (props[prop].length < 2) {
                props[prop].unshift(prop in initial ? initial[prop] : ANIMATION_PROPERTIES[prop]);
            }
            props[prop] = props[prop].map(val => sanitize(prop, val));

            this.length = Math.max(props[prop].length, this.length);
        }

        return new Array(this.length).fill(0).map((_, i) => {
            const keyframe = new Keyframe({ interpolate, origin, useLayout, duration: this.duration / (this.length - 1) }); //OPTIMIZE

            for (const prop in props) {
                if (!(prop in ANIMATION_PROPERTIES)) continue;

                keyframe.addProperty(prop, interpolateProperty(props[prop], i, this.length));
            }

            return keyframe.compile();
        });
    }

    start(element, { immediate = false, reverse = false, repeat = this.repeat } = {}) {
        if (element.Lively.animating && !immediate) {
            element.Lively.queue.push([this, { reverse, repeat }]);
            return;
        }

        this.initial(element, reverse ? this.keyframes[this.length - 1] : this.keyframes[0]);
        element.Lively.index = 1;
        element.Lively.animating = true;

        requestAnimationFrame(() => this.getNext(element, reverse, repeat));
    }

    play(element, { delay = 0, immediate = false, reverse = false } = {}) {
        if (!element.style || !this.length) return;

        if (immediate) {
            element.Lively.queue = [];
            AnimationQueue.cancelAll(element.Lively.timeouts);
        }

        const func = this.start.bind(this, element, { immediate, reverse });
        if (this.delay || delay) {
            AnimationQueue.delay(func, this.delay + delay, element.Lively.timeouts);
        } else {
            func();
        }
    }

    getNext(element, reverse = false, repeat = 1) {
        if (element.Lively.index === this.length) {
            element.Lively.animating = false;

            const [next, options] = element.Lively.queue.shift() || [];
            if (next) return next.start(element, options);

            if (repeat > 1) this.start(element, { reverse, repeat: repeat - 1 });
            return;
        }

        let idx = element.Lively.index;
        if (reverse) idx = this.length - 1 - idx;

        this.keyframes[idx].apply(element, { reverse });
        element.Lively.keyframe = this.keyframes[idx];
        element.Lively.index++;

        AnimationQueue.delay(() => this.getNext(element, reverse, repeat), this.duration / (this.length - 1), element.Lively.timeouts);
    }

}