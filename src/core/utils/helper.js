// export const padArray = (arr, len) => new Array(len).fill(0).map((_, i) => i < arr.length ? arr[i] : arr[arr.length - 1]);

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
};

export const getProperty = (el, prop) => {
    const styles = getComputedStyle(el);

    for (const value of styles.transform.matchAll(/(\w+)\(([^)]+)\)/gi)) {
        const [_, type, val] = value;
        const obj = val.split(', ').reduce((obj, val, i) => (obj[['x', 'y', 'z'][i]] = utils.styleToArr(val), obj), {});
        if (prop === type) return hasKeys(obj, 1) ? obj.x : obj;
    }

    return utils.styleToArr(styles[prop]);
};

export const mergeObjects = (a, b, keys = Object.keys(b)) => {
    for (const key of keys) {
        if (!is.null(b[key])) a[key] = b[key];
    }

    return a;
};

export const merge = (a, b) => {
    if (is.object(a)) {
        const object = {};
        for (const key in a) object[key] = merge(a[key], b[key]);
        return object;
    }

    return [a[0] + b[0], a[1]];
};

export const mergeProperties = (aggregate, props) => {
    for (const prop in props) {
        aggregate[prop] = prop in aggregate ? merge(aggregate[prop], props[prop]) : props[prop];
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