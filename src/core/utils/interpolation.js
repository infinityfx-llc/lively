import Clip from '../clip';
import { isNum, isObj } from './helper';

export const interpolate = (a, b, t, func) => {
    if (isObj(a)) {
        const object = {};
        for (const key in a) object[key] = interpolate(a[key], b[key], t, func);

        return object;
    }

    return [func(a[0], b[0], t), a[1]];
};

export const linear = (a, b, t) => {
    if (!isNum(a) || !isNum(b)) return t > .5 ? b : a;

    return a * (1 - t) + b * t;
};

export const FUNCTIONS = {
    constant: val => val,
    linear,
    ease: (a, b, t) => {
        return linear(a, b, (1 - Math.cos(t * Math.PI)) / 2);
    },
    spring: (a, b, t) => {
        const amplitude = 1;
        const frequency = 2.5;
        const decay = 3.6;

        t = 1 - amplitude * Math.exp(-decay * t) * Math.cos(frequency * Math.pow(t, 2) * Math.PI);
        return linear(a, b, t);
    }
};

export const computeMorph = (next, prev, properties, duration = 1) => {

    const props = { duration }, initial = {};
    for (const prop of properties) { // OPTIMIZE
        if (prop == 'scale') {
            props.scale = { x: 1, y: 1 };
            initial.scale = {
                x: 1 + (prev.layout.width - next.layout.width) / next.layout.width,
                y: 1 + (prev.layout.height - next.layout.height) / next.layout.height
            };
        } else
            if (prop == 'translate') {
                props.translate = { x: 0, y: 0 };

                initial.translate = {
                    x: (prev.layout.x - next.layout.x) * next.layout.parentWidth,
                    y: (prev.layout.y - next.layout.y) * next.layout.parentHeight
                };
            } else {
                props[prop] = next[prop];
                initial[prop] = prev[prop];
            }
    }

    return new Clip(props, initial);
};

