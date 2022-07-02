import AnimationQueue from './queue';
import { hexToRgba, strToRgba } from './utils';

export default class Animation {

    static initials = {
        opacity: 1,
        scale: { x: 1, y: 1 },
        position: { x: 0, y: 0 },
        clip: { left: 0, top: 0, right: 0, bottom: 0 },
        borderRadius: 0,
        active: { start: true },
        backgroundColor: { r: 127, g: 127, b: 127, a: 255 },
        color: { r: 127, g: 127, b: 127, a: 255 }
    }

    constructor({ delay = 0, duration = 1, loop = false, interpolate = 'ease', origin = { x: 0.5, y: 0.5 }, scaleCorrection = false, ...properties } = {}, initial = {}) {
        this.scaleCorrection = scaleCorrection;
        this.keyframes = this.getKeyframes(properties, initial);

        this.delay = delay;
        this.duration = duration;
        this.delta = duration / (this.keyframes.length - 1);
        this.interpolation = interpolate;
        this.origin = this.originToStyle(origin);

        this.loop = loop;
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

        return keyframe !== undefined ? keyframe : Animation.initials[property][key];
    }

    interpolate(from, to, n) {
        if (typeof from === 'string' || typeof to === 'string') return n > 0.5 ? to : from;

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
            val = val[1] === 'px' ? val[0] + 'px' : val[0];
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
                    
                    if (this.scaleCorrection) {
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
                    properties[key] = this.toString(val, 'px');
                    break;
                case 'backgroundColor':
                case 'color':
                    properties[key] = `rgba(${val.r}, ${val.g}, ${val.b}, ${val.a})`;
                    break;
                case 'opacity':
                case 'active':
                    properties[key] = val;
            }
        });

        if (!properties.transform.length) delete properties.transform;
        return properties;
    }

    static setInitial(element) {
        const {
            width,
            height,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,
            borderRadius,
            boxSizing,
            backgroundColor,
            color
        } = getComputedStyle(element);
        const { x, y } = element.getBoundingClientRect();

        if (!('UITools' in element)) element.UITools = {};
        if (!('queue' in element.UITools)) element.UITools.queue = [];
        if (!('initialStyles' in element.UITools)) element.UITools.initialStyles = {
            x,
            y,
            includePadding: boxSizing === 'border-box',
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight,
            width: parseInt(width),
            height: parseInt(height),
            paddingLeft: parseInt(paddingLeft),
            paddingRight: parseInt(paddingRight),
            paddingTop: parseInt(paddingTop),
            paddingBottom: parseInt(paddingBottom),
            borderRadius: parseInt(borderRadius.split(' ')[0]),
            backgroundColor,
            color
        };
    }

    setInitialStyles(element) {
        Animation.setInitial(element);

        const keyframe = this.keyframes[0];
        element.style.transitionDuration = '0s';
        this.apply(element, keyframe, true);
    }

    test(scale, total, size, padStart, padEnd, includePadding) {
        scale = typeof scale === 'string' ? parseInt(scale) / total : scale;
        size = size - (total - scale * total);

        const pad = padStart + padEnd + (size < 0 ? size : 0);
        const ratio = padStart / (padStart + padEnd);
        padStart = includePadding ? scale * padStart : pad * ratio;
        padEnd = includePadding ? scale * padEnd : pad * (1 - ratio);

        return {
            size: (size < 0 ? 0 : size) + 'px',
            padStart: padStart + 'px',
            padEnd: padEnd + 'px'
        };
    }

    apply(element, keyframe, initial = false) {
        const applyStyles = () => {
            const initialStyles = element.UITools.initialStyles;

            Object.entries(keyframe).forEach(([key, val]) => {
                if (key === 'width') {
                    const { clientWidth, width, paddingLeft, paddingRight, includePadding } = initialStyles;
                    const { size, padStart, padEnd } = this.test(val, clientWidth, width, paddingLeft, paddingRight, includePadding);

                    element.style.width = size;
                    element.style.paddingLeft = padStart;
                    element.style.paddingRight = padEnd;
                    return;
                }

                if (key === 'height') {
                    const { clientHeight, height, paddingTop, paddingBottom, includePadding } = initialStyles;
                    const { size, padStart, padEnd } = this.test(val, clientHeight, height, paddingTop, paddingBottom, includePadding);

                    element.style.height = size;
                    element.style.paddingTop = padStart;
                    element.style.paddingBottom = padEnd;
                    return;
                }

                if (key === 'active') return;
                // if (val === 'initial') return element.style[key] = initialStyles[key];

                element.style[key] = val;
            });
        };

        if ('active' in keyframe) {
            let when = Object.keys(keyframe.active)[0];

            if (when === 'start' || initial) {
                element.style.display = keyframe.active[when] ? '' : 'none';
                initial ? applyStyles() : AnimationQueue.delay(applyStyles, 0.01);
            } else {
                AnimationQueue.delay(() => {
                    element.style.display = keyframe.active[when] ? '' : 'none';
                }, this.delta);
                applyStyles();
            }
        } else {
            applyStyles();
        }
    }

    start(element, { immediate = false, reverse = false } = {}) {
        if (element.UITools.animating && !immediate) {
            element.UITools.queue.push([this, { reverse }]);
            return;
        }

        element.style.transitionDuration = `${this.delta}s`;
        element.style.transitionTimingFunction = this.interpolation;
        element.style.transformOrigin = this.origin;
        element.UITools.animating = true;
        element.UITools.index = 1;

        this.getNext(element, reverse);
    }

    play(element, { delay = 0, immediate = false, reverse = false } = {}) {
        if (!element.style) return;

        this.delay || delay ? AnimationQueue.delay(() => this.start(element, { immediate, reverse }), this.delay + delay) : this.start(element, { immediate, reverse });
    }

    getNext(element, reverse = false) {
        if (element.UITools.index === this.keyframes.length) {
            element.UITools.animating = false;

            const [next, options] = element.UITools.queue.shift() || [];
            if (next) return next.start(element, options);

            if (this.loop) this.start(element, options);
            return;
        }

        let idx = element.UITools.index;
        if (reverse) idx = this.keyframes.length - 1 - idx;


        requestAnimationFrame(() => {
            this.apply(element, this.keyframes[idx]);
        });
        element.UITools.index++;

        AnimationQueue.delay(() => this.getNext(element, reverse), this.delta); // cancel this when using immediate
    }

}