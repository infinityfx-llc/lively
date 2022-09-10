import Track from './track';
import { Units } from './utils/convert';
import { getProperty, is } from './utils/helper';
import { interpolate, linear } from './utils/interpolation';

export default class Channel extends Track {

    constructor(convert) {
        super({
            duration: Infinity,
            properties: {},
            convert,
            origin: { x: 0.5, y: 0.5 },
            isEmpty: true
        });

        this.cache = {};
    }

    add(prop, link) {
        this.clip.properties[prop] = link;
        this.clip.isEmpty = false;
    }

    getInterpolatedValue(prop, val, t, element) {
        if (is.null(val.internal.t)) val.internal.t = t;
        if (val.internal.t === t) this.cache[prop] = {};
        
        const x = !val.internal.duration ? 1 : Math.min((t - val.internal.t) / val.internal.duration, 1);

        const cached = this.cache[prop] || {};
        if (cached.t === x) return cached.value;

        const to = Units.toBase(this.clip.convert(val(t, this.clip.duration), prop), prop, element);

        let from = getProperty(element, prop); // THIS SHOULD BE CACHED DURING INTERPOLATION OTHERWISE WRONG SPEED
        from = Units.toBase(from, prop, element);

        const value = interpolate(from, to, x, linear);
        this.cache[prop] = { value, t: x };

        return value;
    }

}