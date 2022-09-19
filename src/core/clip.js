import Channel from './channel';
import { POSITIONS } from './globals';
import Link from './link';
import Track from './track';
import { convert, originToStr } from './utils/convert';
import { hasSomeKey, is, mergeObjects } from './utils/helper';

export default class Clip {

    constructor({ duration = 1, delay, repeat, alternate, interpolate, origin = { x: 0.5, y: 0.5 }, ...properties } = {}, initials = {}) {
        this.duration = duration;
        this.origin = originToStr(origin);
        this.channel = new Channel();

        [this.properties, this.initials] = this.parse(properties, initials);
        this.isEmpty = is.empty(this.properties);

        this.interpolate = interpolate;
        this.defaults = { delay, repeat, alternate };
    }

    length() {
        return this.duration * (this.defaults.repeat || 1) + (this.defaults.delay || 0);
    }

    parse(properties, initials) {
        for (const prop in properties) {
            let val = properties[prop];

            if (Link.isInstance(val)) {
                this.channel.add(prop, val);
                delete properties[prop];
                continue;
            }

            if (is.function(val)) continue;

            val = is.array(val) ? val : [val];
            if (val.length < 2) {
                val.unshift(prop in initials ? initials[prop] : null)
            } else
            if (!is.null(val[0])) initials[prop] = val[0];

            const arr = val.map(val => this.sanitize(val, prop));
            for (let i = 0; i < arr.length; i++) this.quantize(arr, i);

            properties[prop] = arr;
        }

        initials = { ...initials };
        for (const prop in initials) initials[prop] = convert(initials[prop], prop);

        return [properties, initials];
    }

    sanitize(val, prop) {
        val = is.object(val) ? { ...val } : { set: val };

        if (!hasSomeKey(val, POSITIONS)) val = { set: val };
        if (!('set' in val)) val.set = val.start || val.end;
        if ('time' in val && val.time > this.duration) delete val.time;

        for (const key of POSITIONS) {
            if (key in val) val[key] = convert(val[key], prop);
        }

        return val;
    }

    quantize(keys, i, l = i - 1) {
        if ('time' in keys[i]) return keys[i].time;
        if (i == 0 || i == keys.length - 1) return keys[i].time = i == 0 ? 0 : this.duration;

        const low = this.quantize(keys, l, l);
        return keys[i].time = low + (this.quantize(keys, i + 1, l) - low) * ((i - l) / (i - l + 1));
    }

    play(options = {}) {
        return new Track(this, mergeObjects(options, this.defaults));
    }

}