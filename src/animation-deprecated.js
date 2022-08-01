import AnimationQueue from './queue';
import { hexToRgba, isObject, strToRgba } from './utils';

// set interpolate value between keyframes

export default class Animation {

    static initials = {
        opacity: 1,
        scale: { x: 1, y: 1 },
        position: { x: 0, y: 0 },
        rotation: 0,
        clip: { left: 0, top: 0, right: 0, bottom: 0 },
        borderRadius: 0,
        padding: 0,
        fontSize: '1rem',
        backgroundColor: { r: 127, g: 127, b: 127, a: 255 },
        color: { r: 127, g: 127, b: 127, a: 255 },
        active: true,
        interact: true,
        zIndex: 0
    }

    constructor({ delay = 0, duration = 1, repeat = 1, interpolate = 'ease', origin = { x: 0.5, y: 0.5 }, useLayout = false, ...properties } = {}, initial = {}) {
        this.length = 0;
        this.useLayout = useLayout;
        this.keyframes = this.getKeyframes(properties, initial);

        this.delay = delay;
        this.duration = duration;
        this.delta = duration / (this.length - 1);
        this.interpolation = interpolate === 'spring' ? 'cubic-bezier(0.65, 0.34, 0.7, 1.42)' : interpolate;
        this.origin = this.originToStyle(origin);

        this.repeat = repeat;
    }

    originToStyle(origin) {
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
    }

    getKeyframes(properties, initial = {}) {
        for (const key in properties) {
            const first = key in initial ? initial[key] : Animation.initials[key];

            if (!Array.isArray(properties[key])) properties[key] = [properties[key]];
            if (properties[key].length < 2) properties[key].unshift(first);
            properties[key] = properties[key].map(keyframe => this.sanitize(key, keyframe));

            this.length = Math.max(properties[key].length, this.length);
        }

        return new Array(this.length).fill(0).map((_, i) => {
            const keyframe = { start: {}, end: {} };

            for (const key in properties) {
                if (!(key in Animation.initials)) continue;

                const interpolated = this.interpolateKeyframe(properties[key], i, this.length);

                if (!isObject(interpolated) || !('start' in interpolated || 'end' in interpolated || 'set' in interpolated)) {
                    keyframe[key] = interpolated;
                } else {
                    if ('start' in interpolated) keyframe.start[key] = interpolated.start;
                    if ('end' in interpolated) keyframe.end[key] = interpolated.end;
                    if ('set' in interpolated) keyframe[key] = interpolated.set;
                }
            }

            return this.keyframeToStyle(keyframe);
        });
    }

    sanitize(property, keyframe, key = false) {
        if (typeof keyframe === 'string') {
            if (keyframe.match(/^#[0-9a-f]{3,8}$/i)) return hexToRgba(keyframe);
            if (keyframe.match(/^rgba?\(.*\)$/i)) return strToRgba(keyframe);
            let val = parseFloat(keyframe), unit = (keyframe.match(/[^0-9\.]*$/i) || ['px'])[0];
            if (isNaN(val)) return Animation.initials[property];

            if (unit === '%') val /= 100;
            return unit ? [val, unit] : val;
        }
        if (isObject(keyframe)) {
            let arr = Object.keys(keyframe), values = keyframe;
            if ('x' in keyframe || 'y' in keyframe) arr = ['x', 'y'];
            if ('r' in keyframe || 'g' in keyframe || 'b' in keyframe || 'a' in keyframe) arr = ['r', 'g', 'b', 'a'];
            if ('left' in keyframe || 'right' in keyframe || 'top' in keyframe || 'bottom' in keyframe) arr = ['left', 'right', 'top', 'bottom'];

            keyframe = {};
            for (const key of arr) {
                keyframe[key] = this.sanitize(property, values[key], key);
            }
        }

        if (keyframe !== undefined) return keyframe;

        const value = Animation.initials[property];
        return key in value ? value[key] : value;
    }

    interpolate(from, to, n) {
        if (isObject(from)) {
            const obj = {};
            for (const key of Object.keys(from)) {
                obj[key] = this.interpolate(from[key], isObject(to) ? to[key] : to, n);
            }
            return obj;
        }

        let unit = false;
        if (Array.isArray(from)) unit = from[1], from = from[0];
        if (Array.isArray(to)) unit = to[1], to = to[0];

        if (typeof from !== 'number' || typeof to !== 'number') return n > 0.5 ? to : from;

        const res = from * (1 - n) + to * n;
        return unit ? [res, unit] : res;
    }

    interpolateKeyframe(property, i, len) {
        if (property.length === len) return property[i];

        const idx = i * ((property.length - 1) / (len - 1));
        const absIdx = Math.floor(idx);

        let from = property[absIdx];
        if (absIdx === property.length - 1) return from;

        return this.interpolate(from, property[absIdx + 1], idx - absIdx);
    }

    toString(val, unit) {
        if (Array.isArray(val)) unit = val[1], val = val[0];

        return val * (unit === '%' ? 100 : 1) + unit;
    }

    toLength(val) {
        if (Array.isArray(val)) {
            val = val[1] === 'px' ? val[0] + 'px' : val[0]; // maybe vw, etc..
        }

        return val;
    }

    keyframeToStyle(keyframe) {
        let properties = {
            transform: ''
        };

        for (const [key, val] of Object.entries(keyframe)) {
            switch (key) {
                case 'start':
                case 'end': //CHECK TO OPTIMIZE
                    if (Object.keys(val).length) properties[key] = this.keyframeToStyle(val);
                    break;
                case 'position':
                    properties.transform += `translate(${this.toString(val.x, 'px')}, ${this.toString(val.y, 'px')}) `;
                    break;
                case 'scale':
                    if (typeof val === 'number') val = { x: val, y: val };

                    if (this.useLayout) {
                        properties.width = this.toLength(val.x);
                        properties.height = this.toLength(val.y);
                        break;
                    }

                    properties.transform += `scale(${this.toString(val.x, '%')}, ${this.toString(val.y, '%')}) `;
                    break;
                case 'rotation':
                    properties.transform += `rotate(${this.toString(val, 'deg')}) `;
                    break;
                case 'clip':
                    properties.clipPath = `inset(${this.toString(val.top, '%')} ${this.toString(val.right, '%')} ${this.toString(val.bottom, '%')} ${this.toString(val.left, '%')})`;
                    properties.webkitClipPath = properties.clipPath;
                    break;
                case 'borderRadius':
                case 'padding':
                case 'fontSize':
                    properties[key] = this.toString(val, 'px');
                    break;
                case 'backgroundColor':
                case 'color':
                    properties[key] = `rgba(${val.r}, ${val.g}, ${val.b}, ${val.a})`;
                    break;
                case 'interact':
                    properties.pointerEvents = val ? 'all' : 'none';
                    break;
                case 'opacity':
                case 'active':
                case 'zIndex':
                    properties[key] = val;
            }
        }

        if (!properties.transform.length) delete properties.transform;
        return properties;
    }

    setLength(element, keyframe, axis, padStart, padEnd) {
        const size = element.Lively.initials[axis];
        const paddingStart = parseInt(element.Lively.initials[padStart]);
        const paddingEnd = parseInt(element.Lively.initials[padEnd]);
        let val = keyframe[axis];

        const ratio = keyframe.padding ? 1 : paddingStart / (paddingEnd === 0 ? 1e-6 : paddingEnd); // OPTIMIZE
        if (typeof val === 'string') val = `calc(${val} / ${size})`;
        const padding = keyframe.padding ? keyframe.padding : paddingStart + paddingEnd + 'px';

        element.style[axis] = `max(calc(${size} * ${val} - ${element.style.boxSizing !== 'border-box' ? '0px' : padding}), 0px)`;
        const padStyle = `calc(min(calc(${size} * ${val}), ${padding}) * `;
        element.style[padStart] = padStyle + (ratio * 0.5);
        element.style[padEnd] = padStyle + (1 / (ratio === 0 ? 1e-6 : ratio) * 0.5); // OPTIMIZE
    }

    apply(element, keyframe, { duration = this.delta, reverse = false } = {}) { // OPTIMIZE
        const set = () => {
            element.style.transitionDuration = `${duration}s`;
            for (const [key, val] of Object.entries(keyframe)) {
                if (key === 'width') {
                    this.setLength(element, keyframe, 'width', 'paddingLeft', 'paddingRight');
                    continue;
                }
                if (key === 'height') {
                    this.setLength(element, keyframe, 'height', 'paddingTop', 'paddingBottom');
                    continue;
                }
                if ((key === 'padding' && (keyframe.width || keyframe.height)) || key === 'start' || key === 'end') continue;

                element.style[key] = val;
            }
            
            element.Lively.keyframe = keyframe;
        };

        if (('start' in keyframe && !reverse) || ('end' in keyframe && reverse)) {
            this.apply(element, keyframe[reverse ? 'end' : 'start'], { duration: 0 });
            AnimationQueue.delay(set, 0.001);
        } else {
            set();
        }

        if (('end' in keyframe && !reverse) || ('start' in keyframe && reverse)) {
            AnimationQueue.delay(this.apply.bind(this, element, keyframe[reverse ? 'start' : 'end'], { duration: 0 }), this.delta, element.Lively.timeouts);
        }
    }

    setInitial(element, keyframe = this.keyframes[0]) {
        element.style.transitionTimingFunction = this.interpolation;
        element.style.transformOrigin = this.origin;
        this.apply(element, keyframe, { duration: 0 });
    }

    setToLast(element, fallback = false) {
        if (fallback || element.Lively?.keyframe) this.setInitial(element, element.Lively?.keyframe);
    }

    start(element, { immediate = false, reverse = false, repeat = this.repeat } = {}) {
        if (element.Lively.animating && !immediate) {
            element.Lively.queue.push([this, { reverse, repeat }]);
            return;
        }

        this.setInitial(element, reverse ? this.keyframes[this.length - 1] : this.keyframes[0]);
        element.Lively.index = 1;
        element.Lively.animating = true;

        requestAnimationFrame(() => this.getNext(element, reverse, repeat));
    }

    play(element, { delay = 0, immediate = false, reverse = false } = {}) {
        if (!element.style || !this.length) return;

        if (immediate) {
            element.Lively.queue = [];
            AnimationQueue.cancelAll(element.Lively.timeouts);
        }

        const func = this.start.bind(this, element, { immediate, reverse });
        if (this.delay || delay) {
            AnimationQueue.delay(func, this.delay + delay, element.Lively.timeouts);
        } else {
            func();
        }
    }

    getNext(element, reverse = false, repeat = 1) {
        if (element.Lively.index === this.length) {
            element.Lively.animating = false;

            const [next, options] = element.Lively.queue.shift() || [];
            if (next) return next.start(element, options);

            if (repeat > 1) this.start(element, { reverse, repeat: repeat - 1 });
            return;
        }

        let idx = element.Lively.index;
        if (reverse) idx = this.length - 1 - idx;

        this.apply(element, this.keyframes[idx], { reverse });
        element.Lively.index++;

        AnimationQueue.delay(() => this.getNext(element, reverse, repeat), this.delta, element.Lively.timeouts);
    }

}