import AnimationQueue from './queue';
import { hexToRgba, strToRgba } from './utils';

export default class Animation {

    static initials = {
        opacity: 1,
        scale: { x: 1, y: 1 },
        position: { x: 0, y: 0 },
        clip: { left: 0, top: 0, right: 0, bottom: 0 },
        borderRadius: 0,
        padding: 0,
        fontSize: '1em',
        backgroundColor: { r: 127, g: 127, b: 127, a: 255 },
        color: { r: 127, g: 127, b: 127, a: 255 },
        active: { start: true },
        interact: true
    }

    constructor({ delay = 0, duration = 1, repeat = 1, interpolate = 'ease', origin = { x: 0.5, y: 0.5 }, useLayout = false, ...properties } = {}, initial = {}) {
        this.useLayout = useLayout;
        this.keyframes = this.getKeyframes(properties, initial);

        this.delay = delay;
        this.duration = duration;
        this.delta = duration / (this.keyframes.length - 1);
        this.interpolation = interpolate === 'spring' ? 'cubic-bezier(0.65, 0.34, 0.7, 1.42)' : interpolate;
        this.origin = this.originToStyle(origin);

        this.repeat = repeat;
    }

    originToStyle(origin) {
        let x = 0.5, y = 0.5;

        if (typeof origin === 'object') {
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
        let len = 0;

        for (const key in properties) {
            let first = key in initial ? initial[key] : Animation.initials[key];

            if (!Array.isArray(properties[key])) properties[key] = [properties[key]];
            properties[key] = properties[key].length > 1 ? properties[key] : [first, ...properties[key]];
            properties[key] = properties[key].map(keyframe => this.sanitize(key, keyframe));

            len = properties[key].length > len ? properties[key].length : len;
        }

        return new Array(len).fill(0).map((_, i) => {
            const keyframe = {};

            for (const key in properties) {
                if (!(key in Animation.initials)) continue;

                keyframe[key] = this.interpolateKeyframe(properties[key], i, len);
            }

            return this.keyframeToStyle(keyframe);
        });
    }

    sanitize(property, keyframe, key = false) {
        if (typeof keyframe === 'string') {
            if (keyframe.match(/^#[0-9a-f]{3,8}$/i)) return hexToRgba(keyframe);
            if (keyframe.match(/^rgba?\(.*\)$/i)) return strToRgba(keyframe);
            let val = parseFloat(keyframe), unit = keyframe.match(/[^0-9\.]*$/i);
            if (isNaN(val)) return Animation.initials[property];

            if (unit === '%') val /= 100;
            return unit ? [val, unit] : val;
        }
        if (typeof keyframe === 'object') {
            let arr = Object.keys(keyframe);
            if ('x' in keyframe || 'y' in keyframe) arr = ['x', 'y'];
            if ('r' in keyframe || 'g' in keyframe || 'b' in keyframe || 'a' in keyframe) arr = ['r', 'g', 'b', 'a'];
            if ('left' in keyframe || 'right' in keyframe || 'top' in keyframe || 'bottom' in keyframe) arr = ['left', 'right', 'top', 'bottom'];
            arr.forEach(key => {
                keyframe[key] = this.sanitize(property, keyframe[key], key);
            });
        }

        return keyframe !== undefined ? keyframe : key ? Animation.initials[property][key] : Animation.initials[property];
    }

    interpolate(from, to, n) {
        if (typeof from !== 'number' || typeof to !== 'number') return n > 0.5 ? to : from;

        let unit = false;
        if (Array.isArray(from)) unit = from[1], from = from[0];
        if (Array.isArray(to)) unit = to[1], to = to[0];

        const res = from * (1 - n) + to * n;
        return unit ? [res, unit] : res;
    }

    interpolateKeyframe(property, i, len) {
        if (property.length === len) return property[i];

        const idx = i * ((property.length - 1) / (len - 1));
        const absIdx = Math.floor(idx);

        let from = property[absIdx];
        if (absIdx === property.length - 1) return from;
        let to = property[absIdx + 1];

        if (typeof from === 'object') {
            const obj = {};
            Object.keys(from).forEach(key => {
                obj[key] = this.interpolate(from[key], to[key], idx - absIdx);
            });

            return obj;
        }

        return this.interpolate(from, to, idx - absIdx);
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

        Object.entries(keyframe).forEach(([key, val]) => {
            switch (key) {
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
                    properties.transform += `rotate(${this.toString(val), 'deg'}) `;
                    break;
                case 'clip':
                    properties.clipPath = `inset(${this.toString(val.top, '%')} ${this.toString(val.right, '%')} ${this.toString(val.bottom, '%')} ${this.toString(val.left, '%')})`;
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
                    properties[key] = val;
            }
        });

        if (!properties.transform.length) delete properties.transform;
        return properties;
    }

    setInitial(element) {
        element.style.transitionDuration = '0s';
        element.style.transitionTimingFunction = this.interpolation;
        element.style.transformOrigin = this.origin;
        const keyframe = this.keyframes[0];
        this.apply(element, keyframe, true);
    }

    setLength(element, keyframe, axis, padStart, padEnd) {
        const size = element.Lively.initials[axis];
        const paddingStart = parseInt(element.Lively.initials[padStart]);
        const paddingEnd = parseInt(element.Lively.initials[padEnd]);
        let val = keyframe[axis];

        const ratio = keyframe.padding ? 1 : paddingStart / (paddingEnd === 0 ? 1e-6 : paddingEnd);
        if (typeof val === 'string') val = `calc(${val} / ${size})`;
        const padding = keyframe.padding ? keyframe.padding : paddingStart + paddingEnd + 'px';
        
        element.style[axis] = `max(calc(${size} * ${val} - ${element.style.boxSizing !== 'border-box' ? '0px' : padding}), 0px)`;
        const padStyle = `calc(min(calc(${size} * ${val}), ${padding}) * `;
        element.style[padStart] = padStyle + (ratio * 0.5);
        element.style[padEnd] = padStyle + (1 / ratio * 0.5);
    }

    async apply(element, keyframe, initial = false) {
        if ('active' in keyframe) {
            let when = Object.keys(keyframe.active)[0];

            if (when === 'start' || initial) {
                element.style.display = keyframe.active[when] ? '' : 'none';
                if (!initial) await AnimationQueue.sleep(0.001);
            } else {
                AnimationQueue.delay(() => {
                    element.style.display = keyframe.active[when] ? '' : 'none';
                }, this.delta);
            }
        }

        Object.entries(keyframe).forEach(([key, val]) => {
            if (key === 'width') return this.setLength(element, keyframe, 'width', 'paddingLeft', 'paddingRight');
            if (key === 'height') return this.setLength(element, keyframe, 'height', 'paddingTop', 'paddingBottom');

            if (key === 'active' || (key === 'padding' && (keyframe.width || keyframe.height))) return;

            element.style[key] = val;
        });
    }

    start(element, { immediate = false, reverse = false, repeat = this.repeat } = {}) {
        if (element.Lively.animating && !immediate) {
            element.Lively.queue.push([this, { reverse, repeat }]);
            return;
        }

        this.setInitial(element);
        element.style.transitionDuration = `${this.delta}s`;
        element.Lively.animating = true;
        element.Lively.index = 1;

        this.getNext(element, reverse, repeat);
    }

    play(element, { delay = 0, immediate = false, reverse = false } = {}) {
        if (!element.style) return;

        this.delay || delay ? AnimationQueue.delay(() => this.start(element, { immediate, reverse }), this.delay + delay) : this.start(element, { immediate, reverse });
    }

    getNext(element, reverse = false, repeat = 1) {
        if (element.Lively.index === this.keyframes.length) {
            element.Lively.animating = false;

            const [next, options] = element.Lively.queue.shift() || [];
            if (next) return next.start(element, options);

            if (repeat > 1) this.start(element, { reverse, repeat: repeat - 1 });
            return;
        }

        let idx = element.Lively.index;
        if (reverse) idx = this.keyframes.length - 1 - idx;


        requestAnimationFrame(() => {
            this.apply(element, this.keyframes[idx]);
        });
        element.Lively.index++;

        AnimationQueue.delay(() => this.getNext(element, reverse, repeat), this.delta); // cancel this when using immediate
    }

}