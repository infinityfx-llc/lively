import { UNITLESS, UNITS } from '../globals';
import { is } from './helper';

export const hexToRgba = hex => {
    const [_, r, g, b, a] = hex.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i);

    return {
        r: parseInt(r.padStart(2, r), 16),
        g: parseInt(g.padStart(2, g), 16),
        b: parseInt(b.padStart(2, b), 16),
        a: a !== undefined ? parseInt(a, 16) : 255,
    };
};

export const strToRgba = str => {
    const [_, r, g, b, a] = str.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i);

    return {
        r: parseInt(r),
        g: parseInt(g),
        b: parseInt(b),
        a: a !== undefined ? parseInt(a) : 255,
    };
};

export const objToStr = (val, order = Object.keys(val)) => order.map(key => val[key].join('')).join(', ');

export const originToStr = origin => {
    let { x = 0.5, y = 0.5 } = is.object(origin) ? origin : {};

    if (is.string(origin)) {
        switch (origin) {
            case 'left': x = 0;
                break;
            case 'right': x = 1;
                break;
            case 'top': y = 0;
                break;
            case 'bottom': y = 1;
        }
    }

    return { x, y };
};

export const styleToArr = style => {
    const val = style.toString().match(/^([\d.]+)([^\d.]*)$/i);
    if (!val) return [style, null];

    return [parseFloat(val[1]), val[2]];
};

export const Units = {
    emtopx: (val, el = document.body) => val * parseFloat(getComputedStyle(el).fontSize),
    remtopx: val => Units.emtopx(val),
    vwtopx: val => val * window.innerWidth,
    vhtopx: val => val * window.innerHeight,
    vmintopx: val => val * Math.min(window.innerWidth, window.innerHeight),
    vmaxtopx: val => val * Math.max(window.innerWidth, window.innerHeight),
    radtodeg: val => val * 180 / Math.PI,
    fromProperty: prop => {
        if (['rotate', 'skew'].includes(prop)) return 'deg';
        if (['clip', 'scale'].includes(prop)) return '%';
        if (UNITLESS.includes(prop)) return null;

        return 'px';
    },
    toBase: (val, prop, el) => {
        if (is.object(val)) {
            const object = {};
            for (const key in val) object[key] = Units.toBase(val[key], prop);

            return object;
        }

        const newUnit = Units.fromProperty(prop);
        const key = `${val[1]}to${newUnit}`;
        if (is.null(val[1]) && !is.null(newUnit)) return [val[0], newUnit]; // NOT FULLY CORRECT (keep into account string values that have no unit)

        if (!(key in Units)) return val;

        const num = Units[key](val[0], el);

        return [num, newUnit];
    },
    normalize: (unit, prop) => {
        if (is.null(unit) && UNITLESS.includes(prop)) return unit;
        if (UNITS.includes(unit)) return unit;

        return Units.fromProperty(prop);
    }
}