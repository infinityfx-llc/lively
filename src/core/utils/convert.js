import { ANIMATION_PROPERTIES } from '../globals';
import { isObject } from './helper';

export const hexToRgba = (hex) => {
    const [_, r, g, b, a] = hex.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i);

    return {
        r: parseInt(r.padStart(2, r), 16),
        g: parseInt(g.padStart(2, g), 16),
        b: parseInt(b.padStart(2, b), 16),
        a: a !== undefined ? parseInt(a, 16) : 255,
    };
};

export const strToRgba = (str) => {
    const [_, r, g, b, a] = str.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i);

    return {
        r: parseInt(r),
        g: parseInt(g),
        b: parseInt(b),
        a: a !== undefined ? parseInt(a) : 255,
    };
};

export const originToStyle = (origin) => {
    let x = 0.5, y = 0.5;

    if (isObject(origin)) {
        x = origin.x;
        y = origin.y;
    } else
        if (typeof origin === 'string') {
            switch (origin) {
                case 'left':
                    x = 0;
                    break;
                case 'right':
                    x = 1;
                    break;
                case 'top':
                    y = 0;
                    break;
                case 'bottom':
                    y = 1;
            }
        } else {
            x = y = origin;
        }

    return `${x * 100}% ${y * 100}%`;
};

export const sanitize = (prop, val, key = false) => {
    if (typeof val === 'string') {
        if (val.match(/^#[0-9a-f]{3,8}$/i)) return hexToRgba(val);
        if (val.match(/^rgba?\(.*\)$/i)) return strToRgba(val);

        const unit = (val.match(/[^0-9\.]*$/i) || ['px'])[0];
        val = parseFloat(val);
        if (isNaN(val)) return ANIMATION_PROPERTIES[prop];

        if (unit === '%') val /= 100;
        return unit ? [val, unit] : val;
    }
    
    if (isObject(val)) {
        let arr = Object.keys(val), values = val;
        if ('x' in val || 'y' in val) arr = ['x', 'y'];
        if ('r' in val || 'g' in val || 'b' in val || 'a' in val) arr = ['r', 'g', 'b', 'a'];
        if ('left' in val || 'right' in val || 'top' in val || 'bottom' in val) arr = ['left', 'right', 'top', 'bottom'];

        val = {};
        for (const key of arr) {
            val[key] = sanitize(prop, values[key], key);
        }
    }

    if (val !== undefined) return val;

    const initial = ANIMATION_PROPERTIES[prop];
    return key in initial ? initial[key] : initial;
};

export const toString = (val, unit) => {
    if (Array.isArray(val)) unit = val[1], val = val[0];

    return val * (unit === '%' ? 100 : 1) + unit;
};

export const toLength = (val) => {
    if (Array.isArray(val)) {
        val = val[1] === 'px' ? val[0] + 'px' : val[0]; // maybe vw, etc..
    }

    return val;
};