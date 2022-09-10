import { UNITLESS, UNITS } from '../globals';
import { is } from './helper';

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

export const objToStr = (val, seperator, order = Object.keys(val)) => order.map(key => val[key].join('')).join(seperator);

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

        if (!is.number(val[0])) return val; // CHECK FOR OPTIMIZATION

        const unit = Units.fromProperty(prop);
        if (is.null(val[1]) && !is.null(unit)) return [val[0], unit];

        const conversion = Units[`${val[1]}to${unit}`];
        return conversion ? [conversion(val[0], el), unit] : val;
    },
    normalize: (unit, prop) => {
        if (is.null(unit) && UNITLESS.includes(prop)) return unit;
        if (UNITS.includes(unit)) return unit;

        return Units.fromProperty(prop);
    }
};

export const Alias = {
    origin: ['transformOrigin'],
    length: ['strokeDashoffset'],
    clip: ['clipPath', 'webkitClipPath'],
    transformOrigin: val => `${val.x * 100}% ${val.y * 100}%`,
    strokeDashoffset: val => 1 - val[0],
    clipPath: val => `inset(${objToStr(val, ' ', ['top', 'right', 'bottom', 'left'])})`,
    webkitClipPath: val => Alias.clipPath(val)
};