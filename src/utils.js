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

    if (!window.UITools?.Events) window.UITools = { Events: {} };
    if (!(event in window.UITools.Events)) {
        window.UITools.Events[event] = { unique: 0 };
        window.addEventListener(event, e => {
            Object.values(window.UITools.Events[event]).forEach(cb => {
                if (cb instanceof Function) cb(e);
            })
        });
    }

    callback.UITools = { ListenerID: window.UITools.Events[event].unique };
    window.UITools.Events[event][window.UITools.Events[event].unique] = callback;
    window.UITools.Events[event].unique++;
};

export const removeEventListener = (event, callback) => {
    if (typeof window === 'undefined' || !window.UITools?.Events?.[event]) return;
    if (!callback?.UITools?.ListenerID) return;

    delete window.UITools.Events[event][callback.UITools.ListenerID];
}

const Utils = { hexToRgba, strToRgba };
export default Utils;