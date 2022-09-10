import { TRANSFORMS } from '../globals';
import { hexToRgba, strToRgba, styleToArr } from './convert';

export const xor = (a, b) => (a && !b) || (!a && b);

export const hasKeys = (obj, n) => Object.keys(obj).length === n;

export const hasSomeKey = (obj, keys) => Object.keys(obj).some(val => keys.includes(val));

export const is = {
    null: val => typeof val === 'undefined' || val === null,
    array: val => Array.isArray(val),
    object: val => !is.null(val) && typeof val === 'object' && !is.array(val),
    function: val => val instanceof Function,
    string: val => typeof val === 'string',
    bool: val => typeof val === 'boolean',
    number: val => typeof val === 'number',
    empty: obj => hasKeys(obj, 0),
    inViewport: (boundingBox, margin = 0) => {
        const { y, bottom } = boundingBox;
        const h = bottom - y;

        return {
            left: y > window.innerHeight + h * margin,
            entered: y + h * margin < window.innerHeight
        };
    },
    visible: el => {
        const { x, y, right, bottom } = el.getBoundingClientRect();
        const w = right - x;
        const h = bottom - y;
        if (w < 1 || h < 1) return false;

        return y < window.innerHeight && bottom > 0 && x < window.innerWidth && right > 0;
    },
    rgb: val => val.match(/^rgba?\(.*\)$/i),
    hex: val => val.match(/^#[0-9a-f]{3,8}$/i),
    color: val => is.object(val) && 'r' in val
};

export const getProperty = (el, prop) => {
    const styles = getComputedStyle(el);

    if (TRANSFORMS.includes(prop)) {
        const m = new DOMMatrix(styles.transform);

        switch (prop) {
            case 'translate': return { x: [m.e, 'px'], y: [m.f, 'px'] };
            case 'scale':
                return {
                    x: [Math.sqrt(m.a * m.a + m.b * m.b) * 100 * Math.sign(m.a), '%'],
                    y: [Math.sqrt(m.c * m.c + m.d * m.d) * 100 * Math.sign(m.c), '%']
                };
            case 'rotate':
            case 'skew':
                const skew = Math.atan2(m.d, m.c) * 180 / Math.PI - 90;
                const angle = Math.atan2(m.b, m.a) * 180 / Math.PI;

                return prop === 'rotate' ? [angle, 'deg'] : { x: [skew, 'deg'], y: [0, 'deg'] };
        }
    }

    // parse custom properties here aswell

    const val = styles[prop];
    if (is.rgb(val)) return strToRgba(val);

    return styleToArr(val);
};

export const padArray = (arr, len) => new Array(len).fill(0).map((_, i) => i < arr.length ? arr[i] : arr[arr.length - 1]);

export const mergeObjects = (a, b, keys = Object.keys(b)) => {
    for (const key of keys) {
        if (!is.null(b[key])) a[key] = b[key];
    }

    return a;
};

export const merge = (a, b, average = false) => {
    if (is.object(a)) {
        const object = {};
        for (const key in a) object[key] = merge(a[key], b[key]);
        return object;
    }

    return [(a[0] + b[0]) / (+average + 1), a[1]];
};

export const mergeProperties = (aggregate, props) => {
    for (const prop in props) {
        aggregate[prop] = prop in aggregate ? merge(aggregate[prop], props[prop], prop === 'origin') : props[prop]; // maybe average things like scale as well?
    }
};

export const debounce = (cb, ms = 250) => {
    return () => {
        clearTimeout(cb.LivelyTimeout);

        cb.LivelyTimeout = setTimeout(cb, ms);
    };
};

export const throttle = (cb, ms = 250) => {
    return () => {
        const t = Date.now();
        if (cb.LivelyTimestamp - t < ms) return;
        cb.LivelyTimestamp = t;

        cb();
    };
};