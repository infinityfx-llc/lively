import { Units } from './utils/convert';
import { getProperty, is, xor } from './utils/helper';
import * as Interpolate from './utils/interpolation';

export default class Track {

    constructor(clip, { reverse = false, repeat = 1, delay = 0, alternate = false } = {}) {
        this.indices = {};
        this.clip = clip;
        this.t = 0;
        this.T = clip.duration * repeat + delay;

        this.reverse = reverse;
        this.delay = delay;
        this.alternate = alternate;

        // events: onend, onpause, onplay
    }

    getInterpolatedValue(prop, val, t, element) { // FURTHER OPTIMIZE!!
        if (is.function(val)) {
            val = this.clip.convert(val(t, this.clip.duration), prop);
            val = Units.toBase(val, prop, element);
        } else {
            if (!(prop in this.indices)) this.indices[prop] = this.reverse ? val.length - 1 : 0;

            const inc = this.reverse ? -1 : 1;
            let i = this.indices[prop];

            let from = val[i];
            let to = val[i + inc];
            let mainVal = from.set, isMarker;

            if (this.reverse ? to.time > t : to.time < t) {
                this.indices[prop] = i = i + inc;

                const keys = ['start', 'end'];
                const s = keys[+!this.reverse], e = keys[+this.reverse];
                if (s in from || e in to) {
                    mainVal = s in from ? from[s] : to[e];
                    isMarker = true;
                } else {
                    from = val[i];
                    to = val[i + inc];
                }
            }

            if (is.null(mainVal)) mainVal = getProperty(element, prop);
            mainVal = Units.toBase(mainVal, prop, element);

            if (isMarker) {
                val = mainVal;
            } else {
                let scndVal = is.null(to.set) ? getProperty(element, prop) : to.set;
                scndVal = Units.toBase(scndVal, prop, element);

                const func = Interpolate[to.interpolate || this.clip.interpolate] || Interpolate.ease;
                val = Interpolate.interpolate(mainVal, scndVal, (t - from.time) / (to.time - from.time), func);
            }
        }

        return val;
    }

    get(element) {
        let t = this.t - this.delay, d = this.clip.duration;
        const isAlt = this.alternate && Math.floor(t / d) % 2 == !+(this.t >= this.T); // Make more readable and check for correctness
        t = this.t >= this.T ? d : t % d;
        t = xor(this.reverse, isAlt) ? d - t : t;

        const properties = {};

        if (this.t >= this.delay) {
            properties.origin = this.clip.origin;

            for (const prop in this.clip.properties) {
                properties[prop] = this.getInterpolatedValue(prop, this.clip.properties[prop], t, element);
            }
        }

        return properties;
    }

    step(dt) {
        const ended = this.t >= this.T;
        this.t += dt;

        return ended;
    }

}