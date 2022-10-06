import { CONVERSIONS, DEFAULT_OBJECTS, DEFAULT_UNITS, PARSABLE_OBJECTS, UNITS } from '../globals';
import { hasSomeKey, isHex, isNul, isNum, isObj, isRgb, isStr, mapObject } from './helper';

export const convert = (val, prop, sub = false) => {
    if (isNul(val)) return null;

    if (prop === 'scale' && !sub && !isObj(val)) val = { x: val, y: val }; // OPTIMIZE
    if (isObj(val)) {
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
    if (isStr(val)) {
        if (isHex(val)) return hexToRgba(val);
        if (isRgb(val)) return strToRgba(val);

        [val, unit] = styleToArr(val);
        if (unit == '%') val /= 100;
    }

    unit = isNum(val) ? Units.normalize(unit, prop) : null;

    return [val, unit];
};

export const hexToRgba = hex => {
    const [_, r, g, b, a] = hex.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i);
    const t = val => [isNul(val) ? 255 : parseInt(val.padStart(2, val), 16), null];

    return { r: t(r), g: t(g), b: t(b), a: t(a) };
};

export const strToRgba = str => {
    const [_, r, g, b, a] = str.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i);
    const t = val => [isNul(val) ? 255 : parseInt(val), null];

    return { r: t(r), g: t(g), b: t(b), a: t(a) };
};

export const objToStr = (val, seperator, order = Object.keys(val)) => order.map(key => arrToStyle(val[key])).join(seperator);

export const originToStr = origin => {
    let { x = 0.5, y = 0.5 } = isObj(origin) ? origin : {};

    if (isStr(origin)) {
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
    const val = style.toString().match(/^(-?[\d.]+)([^\d.]*)$/i);
    if (!val) return [style, null];

    return [parseFloat(val[1]), val[2] || null];
};

export const arrToStyle = arr => {
    return (arr[1] == '%' ? arr[0] * 100 : arr[0]) + (isNul(arr[1]) ? '' : arr[1]);
};

export const Units = {
    fromProperty: prop => prop in DEFAULT_UNITS ? DEFAULT_UNITS[prop] : DEFAULT_UNITS.default,
    toBase: (val, prop, el, key) => { // WIP
        if (isObj(val)) {
            return mapObject(val, val => Units.toBase(val, prop, el, key));
        }

        if (!isNum(val[0])) return val; // CHECK FOR OPTIMIZATION

        const unit = Units.fromProperty(prop);
        if (isNul(val[1]) && !isNul(unit)) return [val[0], unit];

        const convert = CONVERSIONS[`${val[1]}_${unit}`];
        return convert ? [convert(val[0], el, key || prop), unit] : val;
    },
    normalize: (unit, prop) => {
        if (UNITS.includes(unit) || (isNul(unit) && prop in DEFAULT_UNITS)) return unit;

        return Units.fromProperty(prop);
    }
};

export const Aliases = { // Implement reverse for property parsing
    origin: 'transformOrigin',
    length: 'strokeDashoffset',
    clip: 'clipPath',
    transformOrigin: val => `${val.x * 100}% ${val.y * 100}%`,
    strokeDashoffset: val => 1 - val[0],
    clipPath: val => `inset(${objToStr(val, ' ', ['top', 'right', 'bottom', 'left'])})`
};