import { convert, Units } from './utils/convert';
import { getProperty, isFunc, isNul, isVisible, xor } from './utils/helper';
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
        if (isNul(val)) val = getProperty(element, prop);
        return Units.toBase(val, prop, element);
    }

    getInterpolatedValue(prop, val, t, element, ended) { // FURTHER OPTIMIZE!!
        if (isFunc(val)) {
            return Units.toBase(convert(val(t, this.clip.duration), prop), prop, element);
        }

        const inc = this.reverse ? -1 : 1;
        let i = this.indices[prop];

        let keyframe, to = val[i + inc], idxIsNul = isNul(i);

        if (idxIsNul || (this.reverse ? val[i].time < t : val[i].time > t)) {
            this.indices[prop] = i = this.reverse ? val.length - 1 : 0; // reset indices for repeat

            if (idxIsNul) {
                keyframe = this.reverse ? val[i].end : val[i].start;
            } else {
                keyframe = this.reverse ? to.start : to.end;
            }
        }
        
        to = val[i + inc];
        if (this.reverse ? to.time > t : to.time < t) {
            keyframe = this.reverse ? (to.end || val[i].start) : (to.start || val[i].end);

            this.indices[prop] = i = i + inc;
            to = val[i + inc];
        }

        if (ended) keyframe = this.reverse ? to.start : to.end;
        if (keyframe) return this.normalize(keyframe, prop, element);

        const mainVal = this.normalize(val[i].set, prop, element);
        const scndVal = this.normalize(to.set, prop, element);
        const func = FUNCTIONS[to.interpolate || this.clip.interpolate] || FUNCTIONS.ease;

        return interpolate(mainVal, scndVal, (t - val[i].time) / (to.time - val[i].time), func);
    }

    get(element, cull = true) {
        const properties = {}, end = this.t >= this.T;

        let t = this.t - this.delay, d = this.clip.duration;
        if (t < 0 || (cull && !end && !isVisible(element))) return properties;

        const isAlt = this.alternate && Math.floor(t / d) % 2 == +!end;

        t = end ? d : t % d;
        t = xor(this.reverse, isAlt) ? d - t : t;

        properties.origin = this.clip.origin;
        for (const prop in this.clip.properties) {
            properties[prop] = this.getInterpolatedValue(prop, this.clip.properties[prop], t, element, end);
        }

        return properties;
    }

    step(dt) {
        const ended = this.t >= this.T;
        this.t += dt;

        if (ended && isFunc(this.callback)) this.callback();
        return ended;
    }

}