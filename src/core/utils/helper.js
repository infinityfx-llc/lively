import { MERGE_FUNCTIONS, MORPH_PROPERTIES } from '../globals';
import { convert, strToRgba, styleToArr } from './convert';

export const xor = (a, b) => (a && !b) || (!a && b);

export const padArray = (arr, len) => new Array(len).fill(0).map((_, i) => i < arr.length ? arr[i] : arr[arr.length - 1]);

export const subArray = (arr, sub) => arr.filter(val => !sub.includes(val));

export const hasKeys = (obj, n) => Object.keys(obj).length === n;

export const hasSomeKey = (obj, keys) => Object.keys(obj).some(val => keys.includes(val));

export const inViewport = (boundingBox, margin = 0) => {
    const { y, bottom } = boundingBox;
    const h = bottom - y;

    return {
        left: y > window.innerHeight + h * margin,
        entered: y + h * margin < window.innerHeight
    };
};

export const isVisible = el => {
    const { x, y, right, bottom } = el.getBoundingClientRect();
    const w = right - x;
    const h = bottom - y;
    if (w < 1 || h < 1) return false;

    return y < window.innerHeight && bottom > 0 && x < window.innerWidth && right > 0;
};

export const isNul = val => typeof val === 'undefined' || val === null;
export const isArr= val => Array.isArray(val);
export const isObj = val => !isNul(val) && typeof val === 'object' && !isArr(val);
export const isFunc= val => val instanceof Function;
export const isStr= val => typeof val === 'string';
export const isBool = val => typeof val === 'boolean';
export const isNum = val => typeof val === 'number';
export const isEmpty = obj => hasKeys(obj, 0);
export const isRgb = val => val.match(/^rgba?\(.*\)$/i);
export const isHex = val => val.match(/^#[0-9a-f]{3,8}$/i);
export const isColor = val => isObj(val) && 'r' in val;

export const decomposeTransform = transform => {
    const m = new DOMMatrix(transform);

    const x = Math.sqrt(m.a * m.a + m.b * m.b) * Math.sign(m.a);
    const y = Math.sqrt(m.c * m.c + m.d * m.d) * Math.sign(m.d);
    const skew = Math.atan2(m.d, m.c) * 180 / Math.PI - 90;
    const rotate = Math.atan2(m.b, m.a) * 180 / Math.PI;

    return {
        translate: { x: m.e, y: m.f },
        scale: { x, y },
        rotate,
        skew: { x: skew, y: 0 }
    };
};

export const getProperty = (el, prop) => {
    const styles = getComputedStyle(el);

    const transform = decomposeTransform(styles.transform);
    if (prop in transform) return convert(transform[prop], prop);

    if (prop === 'length') return [1 - parseFloat(styles.strokeDashoffset), null];
    // parse custom property clip here

    const val = styles[prop];
    if (isRgb(val)) return strToRgba(val);

    return styleToArr(val);
};

export const getSnapshot = (el, toParent = false) => {
    const styles = getComputedStyle(el);
    let { x, y, width, height } = el.getBoundingClientRect();

    const parent = (toParent ? el.parentElement : document.body).getBoundingClientRect();
    x = ((x - parent.x) + width / 2) / parent.width;
    y = ((y - parent.y) + height / 2) / parent.height;

    const props = { layout: { x, y, width, height, parentWidth: parent.width, parentHeight: parent.height } };
    for (const prop of MORPH_PROPERTIES) props[prop] = styles[prop]; // OPTIMIZE
    Object.assign(props, decomposeTransform(styles.transform));

    return props;
};

export const mergeObjects = (a, b, keys = Object.keys(b)) => {
    for (const key of keys) {
        if (!isNul(b[key])) a[key] = b[key];
    }

    return a;
};

export const merge = (a, b, func) => {
    if (isObj(a)) {
        return mapObject(a, (val, key) => merge(val, b[key], func));
    }

    if (!isNum(a[0]) || !isNum(b[0])) return b;

    return [func(a[0], b[0]), a[1]];
};

export const mergeProperties = (aggregate, props) => {
    for (const prop in props) {
        const func = MERGE_FUNCTIONS[prop] || MERGE_FUNCTIONS.default;

        aggregate[prop] = prop in aggregate ? merge(aggregate[prop], props[prop], func) : props[prop];
    }
};

export const mapObject = (obj, func) => {
    const copy = {};
    for (const key in obj) copy[key] = func(obj[key], key);

    return copy;
};

export const throttle = (cb, ms = 250) => {
    return () => {
        const t = Date.now();
        if (t - cb.LivelyTimestamp < ms) return;
        cb.LivelyTimestamp = t;

        cb();
    };
};