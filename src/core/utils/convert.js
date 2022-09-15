import { DEFAULT_OBJECTS, DEFAULT_UNITS, PARSABLE_OBJECTS, UNITS } from '../globals';
import { hasSomeKey, is } from './helper';

export const convert = (val, prop, sub = false) => {
    if (is.null(val)) return null;

    if (prop === 'scale' && !sub && !is.object(val)) val = { x: val, y: val }; // OPTIMIZE
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
            const def = prop in DEFAULT_OBJECTS ? DEFAULT_OBJECTS[prop][key] : DEFAULT_OBJECTS[key];
            val[key] = key in val ? convert(val[key], prop, true) : def;
        }

        return val;
    }

    let unit;
    if (is.string(val)) {
        if (is.hex(val)) return hexToRgba(val);
        if (is.rgb(val)) return strToRgba(val);

        [val, unit] = styleToArr(val);
        if (unit == '%') val /= 100;
    }

    unit = is.number(val) ? Units.normalize(unit, prop) : null;

    return [val, unit];
};

export const hexToRgba = hex => {
    const [_, r, g, b, a] = hex.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i);
    const t = val => [is.null(val) ? 255 : parseInt(val.padStart(2, val), 16), null];

    return { r: t(r), g: t(g), b: t(b), a: t(a) };
};

export const strToRgba = str => {
    const [_, r, g, b, a] = str.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i);
    const t = val => [is.null(val) ? 255 : parseInt(val), null];

    return { r: t(r), g: t(g), b: t(b), a: t(a) };
};

export const objToStr = (val, seperator, order = Object.keys(val)) => order.map(key => arrToStyle(val[key])).join(seperator);

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

    return [parseFloat(val[1]), val[2] || null];
};

export const arrToStyle = arr => {
    return (arr[1] == '%' ? arr[0] * 100 : arr[0]) + (is.null(arr[1]) ? '' : arr[1]);
};

export const Units = { // implement % conversion
    emtopx: (val, el = document.body) => val * parseFloat(getComputedStyle(el).fontSize),
    remtopx: val => Units.emtopx(val),
    vwtopx: val => val * window.innerWidth,
    vhtopx: val => val * window.innerHeight,
    vmintopx: val => val * Math.min(window.innerWidth, window.innerHeight),
    vmaxtopx: val => val * Math.max(window.innerWidth, window.innerHeight),
    radtodeg: val => val * 180 / Math.PI,
    fromProperty: prop => prop in DEFAULT_UNITS ? DEFAULT_UNITS[prop] : DEFAULT_UNITS.default,
    toBase: (val, prop, el) => {
        if (is.object(val)) {
            const object = {};
            for (const key in val) object[key] = Units.toBase(val[key], prop);

            return object;
        }

        if (!is.number(val[0])) return val; // CHECK FOR OPTIMIZATION

        const unit = Units.fromProperty(prop);
        if (is.null(val[1]) && !is.null(unit)) return [val[0], unit];

        const conversion = Units[`${val[1]}to${unit}`];
        return conversion ? [conversion(val[0], el), unit] : val;
    },
    normalize: (unit, prop) => {
        if (UNITS.includes(unit) || (is.null(unit) && prop in DEFAULT_UNITS)) return unit;

        return Units.fromProperty(prop);
    }
};

const clipPath = val => `inset(${objToStr(val, ' ', ['top', 'right', 'bottom', 'left'])})`;

export const Alias = { // OPTIMIZE
    origin: ['transformOrigin'],
    length: ['strokeDashoffset'],
    clip: ['clipPath', 'webkitClipPath'],
    transformOrigin: val => `${val.x * 100}% ${val.y * 100}%`,
    strokeDashoffset: val => 1 - val[0],
    clipPath,
    webkitClipPath: clipPath
};