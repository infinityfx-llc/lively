import { convert, Units } from './utils/convert';
import { getProperty, is, isVisible, xor } from './utils/helper';
import { FUNCTIONS, interpolate } from './utils/interpolation';

export default class Track {

    constructor(clip, { reverse = false, repeat = 1, delay = 0, alternate = false, callback } = {}) {
        this.indices = {};
        this.clip = clip;
        this.t = 0;
        this.T = clip.duration * repeat + delay;

        this.reverse = reverse;
        this.delay = delay;
        this.alternate = alternate;
        this.callback = callback;
    }

    normalize(val, prop, element) {
        if (is.null(val)) val = getProperty(element, prop);
        return Units.toBase(val, prop, element);
    }

    getInterpolatedValue(prop, val, t, element) { // FURTHER OPTIMIZE!!
        if (is.function(val)) {
            return Units.toBase(convert(val(t, this.clip.duration), prop), prop, element);
        }

        const inc = this.reverse ? -1 : 1;
        let i = this.indices[prop];
        if (is.null(i) || (this.reverse ? t - val[i].time : val[i].time - t) > 0) this.indices[prop] = i = this.reverse ? val.length - 1 : 0; // reset indices for repeat

        let from = val[i];
        let to = val[i + inc];

        if (this.reverse ? to.time > t : to.time < t) {
            this.indices[prop] = i = i + inc;

            const keys = ['start', 'end'];
            const start = keys[+!this.reverse], end = keys[+this.reverse];
            if (start in from || end in to) {
                return this.normalize(start in from ? from[start] : to[end], prop, element);
            } else {
                from = val[i];
                to = val[i + inc];
            }
        }

        const mainVal = this.normalize(from.set, prop, element);
        const scndVal = this.normalize(to.set, prop, element);
        const func = FUNCTIONS[to.interpolate || this.clip.interpolate] || FUNCTIONS.ease;

        return interpolate(mainVal, scndVal, (t - from.time) / (to.time - from.time), func);
    }

    get(element, cull = true) {
        const properties = {}, end = this.t >= this.T;
        if (this.t < this.delay || (cull && !end && !isVisible(element))) return properties;

        let t = this.t - this.delay, d = this.clip.duration;
        const isAlt = this.alternate && Math.floor(t / d) % 2 == +!end; // Make more readable and check for correctness
        t = end ? d : t % d;
        t = xor(this.reverse, isAlt) ? d - t : t;

        properties.origin = this.clip.origin;
        for (const prop in this.clip.properties) {
            properties[prop] = this.getInterpolatedValue(prop, this.clip.properties[prop], t, element);
        }

        return properties;
    }

    step(dt) {
        const ended = this.t >= this.T;
        this.t += dt;

        if (ended && is.function(this.callback)) this.callback();
        return ended;
    }

}