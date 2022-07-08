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

    if (!window.Lively?.Events) window.Lively = { Events: {} };
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
    if (!callback?.Lively?.ListenerID) return;

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
    for (const key in styles) {
        element.style[key] = styles[key];
    }
};

export const cacheElementStyles = (element) => {
    if (!('Lively' in element)) element.Lively = { queue: [], initials: {} };
    if (!element.Lively.style) {
        element.Lively.style = getStyles(element);
        element.Lively.style.transitionProperty = 'transform, opacity, clip-path, border-radius, font-size, background-color, color, width, height, padding';
        element.Lively.style.willChange = 'transform';
    }

    element.style = {};
    setStyles(element, element.Lively.style);

    const { paddingLeft, paddingRight, paddingTop, paddingBottom, backgroundColor, color, borderRadius, padding, fontSize } = getComputedStyle(element);
    const { x, y } = element.getBoundingClientRect();

    element.Lively.initials = { x, y, paddingLeft, paddingRight, paddingTop, paddingBottom, backgroundColor, color, fontSize,
        width: element.offsetWidth + 'px',
        height: element.offsetHeight + 'px',
        borderRadius: borderRadius.split(' ')[0],
        padding: padding.split(' ')[0]
    };
};

const Utils = { hexToRgba, strToRgba, addEventListener, removeEventListener, cacheElementStyles };
export default Utils;