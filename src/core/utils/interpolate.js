import { isObject } from './helper';

export const interpolate = (from, to, n) => {
    if (isObject(from)) {
        const object = {};
        for (const key in from) {
            object[key] = interpolate(from[key], isObject(to) ? to[key] : to, n);
        }
        return object;
    }

    let unit;
    if (Array.isArray(from)) unit = from[1], from = from[0];
    if (Array.isArray(to)) unit = to[1], to = to[0];

    if (typeof from !== 'number' || typeof to !== 'number') return n > 0.5 ? to : from;

    const interpolated = from * (1 - n) + to * n;
    return unit ? [interpolated, unit] : interpolated;
};

export const interpolateProperty = (property, n, max) => {
    if (property.length === max) return property[n];

    const idx = n * ((property.length - 1) / (max - 1));
    const lowIdx = Math.floor(idx);

    if (lowIdx === property.length - 1) return property[lowIdx];

    return interpolate(property[lowIdx], property[lowIdx + 1], idx - lowIdx);
};