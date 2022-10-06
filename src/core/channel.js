import Track from './track';
import { convert, Units } from './utils/convert';
import { getProperty, isNul } from './utils/helper';
import { FUNCTIONS, interpolate } from './utils/interpolation';

export default class Channel extends Track {

    constructor(interpolate) {
        super({
            duration: Infinity,
            properties: {},
            origin: { x: 0.5, y: 0.5 },
            interpolate
        });

        this.isEmpty = true
        this.cache = {};
    }

    add(prop, link) {
        this.clip.properties[prop] = link;
        this.isEmpty = false;
    }

    getInterpolatedValue(prop, val, t, element) {
        if (isNul(val.internal.t)) val.internal.t = t;
        if (val.internal.t === t) this.cache[prop] = {};

        const x = !val.internal.duration ? 1 : Math.min((t - val.internal.t) / val.internal.duration, 1);

        const cached = this.cache[prop] || {};
        if (cached.t === x) return cached.value;

        let value = Units.toBase(convert(val(), prop), prop, element);
        let from = cached.from;

        if (x != 1) {
            if (!from) from = Units.toBase(getProperty(element, prop), prop, element);

            const func = FUNCTIONS[this.clip.interpolate] || FUNCTIONS.linear;
            value = interpolate(from, value, x, func);
        }
        this.cache[prop] = { value, from: x != 1 ? from : null, t: x };

        return value;
    }

}