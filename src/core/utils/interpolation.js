import { is } from './helper';

export const interpolate = (a, b, t, func) => {
    if (is.object(a)) {
        const object = {};
        for (const key in a) object[key] = interpolate(a[key], b[key], t, func);

        return object;
    }

    return [func(a[0], b[0], t), a[1]];
};

export const constant = val => val;

export const linear = (a, b, t) => {
    if (!is.number(a) || !is.number(b)) return t > .5 ? b : a;

    return a * (1 - t) + b * t;
};

export const ease = (a, b, t) => {
    return linear(a, b, (1 - Math.cos(t * Math.PI)) / 2);
};

export const spring = (a, b, t) => {
    const amplitude = 1;
    const frequency = 2.5;
    const decay = 3.6;

    t = 1 - amplitude * Math.exp(-decay * t) * Math.cos(frequency * Math.pow(t, 2) * Math.PI);
    return linear(a, b, t);
};