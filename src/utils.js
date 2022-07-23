export const livelyProperty = (prop, val, object = window) => {
    if (!('Lively' in object)) object.Lively = {};
    if (!(prop in object.Lively)) object.Lively[prop] = val;
};

export const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val);

export const padArray = (arr, len) => new Array(len).fill(0).map((_, i) => i < arr.length ? arr[i] : arr[arr.length - 1]);

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

export const addEventListener = (event, callback) => {
    if (!(callback instanceof Function)) return;

    livelyProperty('Events', {});
    if (!(event in window.Lively.Events)) {
        window.Lively.Events[event] = { unique: 0 };
        window.addEventListener(event, e => {
            Object.values(window.Lively.Events[event]).forEach(cb => {
                if (cb instanceof Function) cb(e);
            });
        });
    }

    const e = window.Lively.Events[event];
    callback.Lively = { ListenerID: e.unique };
    e[e.unique++] = callback;
};

export const removeEventListener = (event, callback) => {
    if (typeof window === 'undefined' || !window.Lively?.Events?.[event]) return;
    if (!callback?.Lively || !('ListenerID' in callback.Lively)) return;

    delete window.Lively.Events[event][callback.Lively.ListenerID];
};

const getStyles = (element) => {
    const styles = {};
    for (let i = 0; i < element.style.length; i++) {
        styles[element.style[i]] = element.style[element.style[i]];
    }

    return styles;
};

const setStyles = (element, styles) => {
    element.style = {};

    for (const key in styles) {
        element.style[key] = styles[key];
    }
};

export const cacheElementStyles = (element) => {
    livelyProperty('queue', [], element);
    if (!element.Lively.style) {
        element.Lively.style = getStyles(element);
        element.Lively.style.transitionProperty = 'transform, opacity, clip-path, border-radius, font-size, background-color, color, width, height, padding';
        element.Lively.style.willChange = 'transform';
    }

    setStyles(element, element.Lively.style);

    const { paddingLeft, paddingRight, paddingTop, paddingBottom, backgroundColor, color, borderRadius, padding, fontSize, zIndex } = getComputedStyle(element);
    const { x, y, width, height } = element.getBoundingClientRect();

    element.Lively.initials = {
        x, y, paddingLeft, paddingRight, paddingTop, paddingBottom, backgroundColor, color, fontSize, zIndex,
        width: width + 'px',
        height: height + 'px',
        borderRadius: borderRadius.split(' ')[0],
        padding: padding.split(' ')[0]
    };
};

const Utils = { livelyProperty, isObject, padArray, hexToRgba, strToRgba, addEventListener, removeEventListener, cacheElementStyles };
export default Utils;