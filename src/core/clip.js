import Channel from './channel';
import { DEFAULTS, PARSABLE_OBJECTS, POSITIONS } from './globals';
import Link from './link';
import Track from './track';
import { hexToRgba, originToStr, strToRgba, styleToArr, Units } from './utils/convert';
import { hasSomeKey, is, mergeObjects } from './utils/helper';

export default class Clip {

    constructor({ duration = 1, delay, repeat, alternate, origin = { x: 0.5, y: 0.5 }, ...properties } = {}, initial = {}) {
        this.duration = duration;
        this.origin = originToStr(origin); // APPLY THIS SOMEWHERE!

        this.initial = initial;
        this.initials = { ...initial }; // OPTIMIZE
        this.channel = new Channel(this.convert.bind(this)); // OPTIMIZE

        this.properties = this.parse(properties);
        this.isEmpty = is.empty(this.properties);

        this.defaults = { delay, repeat, alternate };
    }

    length() {
        return this.duration * (this.defaults.repeat || 1) + (this.defaults.delay || 0);
    }

    parse(properties) {
        for (const prop in properties) {
            let val = properties[prop];

            if (Link.isInstance(val)) {
                this.channel.add(prop, val);
                delete properties[prop];
                continue;
            }

            if (is.function(val)) continue;

            val = is.array(val) ? val : [val];
            val.length < 2 ? val.unshift(prop in this.initial ? this.initial[prop] : null) : this.initials[prop] = val[0];

            const arr = val.map(val => this.sanitize(val, prop));
            for (let i = 0; i < arr.length; i++) this.quantize(arr, i);

            properties[prop] = arr;
        }

        for (const prop in this.initials) this.initials[prop] = this.convert(this.initials[prop], prop);

        return properties;
    }

    sanitize(val, prop) {
        if (!is.object(val)) val = { set: val };

        if (!hasSomeKey(val, POSITIONS)) val = { set: val };
        if (!('set' in val)) val.set = 'start' in val ? val.start : val.end;
        if ('time' in val && val.time > this.duration) delete val.time;

        val = { ...val }; // CHECK
        for (const key of POSITIONS) {
            if (key in val) val[key] = this.convert(val[key], prop);
        }

        return val;
    }

    quantize(keys, i, l = i - 1) {
        if ('time' in keys[i]) return keys[i].time;
        if (i == 0 || i == keys.length - 1) return keys[i].time = i == 0 ? 0 : this.duration;

        const low = this.quantize(keys, l, l);
        return keys[i].time = low + (this.quantize(keys, i + 1, l) - low) * ((i - l) / (i - l + 1));
    }

    convert(val, prop) {
        if (is.null(val)) return prop in this.initial ? this.convert(this.initial[prop], prop) : null;

        if (is.object(val)) {
            let keys = Object.keys(val);

            for (const arr of PARSABLE_OBJECTS) {
                if (hasSomeKey(val, arr)) {
                    keys = arr;
                    break;
                }
            }

            val = { ...val }; // CHECK
            for (const key of keys) {
                const def = prop in DEFAULTS ? DEFAULTS[prop][key] : DEFAULTS[key];
                val[key] = key in val ? this.convert(val[key]) : def;
            }

            return val;
        }

        let u;
        if (is.string(val)) {
            if (val.match(/^#[0-9a-f]{3,8}$/i)) return hexToRgba(val);
            if (val.match(/^rgba?\(.*\)$/i)) return strToRgba(val);

            [val, u] = styleToArr(val);
            if (!u) return [val, u];
        }

        u = Units.normalize(u, prop);

        return [val, u];
    }

    play(options = {}) {
        return new Track(this, mergeObjects(options, this.defaults));
    }

}