import AnimationQueue from './queue';

export default class Animation {

    static initials = {
        opacity: 1,
        scale: { x: 1, y: 1 },
        position: { x: 0, y: 0 },
        clip: { left: 0, top: 0, right: 0, bottom: 0 },
        borderRadius: 0,
        active: { value: true, at: 0 }
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

    static from(options, initial = {}, scaleCorrection = false) {
        if (!options || typeof options === 'boolean') return null;

        return new Animation({ ...options, scaleCorrection }, initial);
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
                    case 'center':
                        break;
                    default:
                        x = y = parseFloat(origin);
                }
            } else {
                x = y = origin;
            }

        return `${x * 100}% ${y * 100}%`;
    }

    getKeyframes(properties, initial = {}) {
        for (const key in properties) {
            let first = key in initial ? initial[key] : Animation.initials[key];

            if (Array.isArray(properties[key])) {
                properties[key] = properties[key].length > 1 ? properties[key] : [first, ...properties[key]];
            } else {
                properties[key] = [first, properties[key]];
            }
        }

        const len = Object.values(properties).reduce((len, arr) => arr.length > len ? arr.length : len, 0);
        let keyframes = new Array(len).fill(0);

        keyframes = keyframes.map((_, i) => {
            const keyframe = {};

            for (const key in properties) {
                keyframe[key] = this.interpolateKeyframe(properties[key], i, len);
            }

            return this.keyframeToStyle(keyframe);
        });

        return keyframes;
    }

    interpolate(from, to, n) { // when interpolating pure strings fix!!! (also bools)
        let unit = typeof from === 'string' ? from.match(/[^0-9\.]*/i) : null;
        if (typeof to === 'string' && !unit) unit = to.match(/[^0-9\.]*/i);

        from = parseFloat(from);
        to = parseFloat(to);

        const res = from * (1 - n) + to * n;
        return unit ? res + unit : res;
    }

    interpolateKeyframe(property, i, len) {
        if (!property) return null;
        if (property.length === len) return property[i];

        const idx = i * ((property.length - 1) / (len - 1));
        const absIdx = Math.floor(idx);

        let from = property[absIdx];
        let to = absIdx === property.length - 1 ? null : property[absIdx + 1];
        if (!to) return from;

        if (typeof from === 'object') {
            const obj = {};
            Object.keys(from).forEach(key => {
                obj[key] = this.interpolate(from[key], to[key], idx - absIdx);
            });

            return obj;
        }

        return this.interpolate(from, to, idx - absIdx);
    }

    propertyToString(property, value, key, unit) {
        value = value[key];
        if (typeof value === 'string') return value;

        value = isNaN(value) ? Animation.initials[property][key] : value;
        return `${value * (unit === '%' ? 100 : 1)}${unit}`;
    }

    propertyToNumber(property, value, key) {
        value = value[key];
        if (typeof value === 'string') {
            return value.match(/[^0-9\.]*/i) === '%' ? parseFloat(value) / 100 : value;
        }

        return isNaN(value) ? Animation.initials[property][key] : value;
    }

    keyframeToStyle(keyframe) {
        let properties = {
            transform: ''
        };

        Object.entries(keyframe).forEach(([key, val]) => {
            if (val === null || val === undefined) return;

            switch (key) {
                case 'position':
                    properties.transform += `translate(${this.propertyToString(key, val, 'x', 'px')}, ${this.propertyToString(key, val, 'y', 'px')}) `;
                    break;
                case 'scale':
                    val = typeof val !== 'object' ? { x: val, y: val } : val;

                    if (this.scaleCorrection) {
                        properties.width = this.propertyToNumber(key, val, 'x');
                        properties.height = this.propertyToNumber(key, val, 'y');
                        break;
                    }

                    properties.transform += `scale(${this.propertyToString(key, val, 'x', '%')}, ${this.propertyToString(key, val, 'y', '%')}) `;
                    break;
                case 'rotation':
                    properties.transform += `rotate(${parseFloat(val)}deg) `;
                    break;
                case 'clip':
                    const top = this.propertyToString(key, val, 'top', '%'), right = this.propertyToString(key, val, 'right', '%'),
                        bottom = this.propertyToString(key, val, 'bottom', '%'), left = this.propertyToString(key, val, 'left', '%');

                    properties.clipPath = `inset(${top} ${right} ${bottom} ${left})`;
                    break;
                case 'borderRadius':
                    properties[key] = typeof val === 'string' ? val : val + 'px';
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
            boxSizing
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
            borderRadius: parseInt(borderRadius.split(' ')[0])
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
            Object.entries(keyframe).forEach(([key, val]) => {
                if (key === 'width') {
                    const { clientWidth, width, paddingLeft, paddingRight, includePadding } = element.UITools.initialStyles;
                    const { size, padStart, padEnd } = this.test(val, clientWidth, width, paddingLeft, paddingRight, includePadding);

                    element.style.width = size;
                    element.style.paddingLeft = padStart;
                    element.style.paddingRight = padEnd;
                    return;
                }

                if (key === 'height') {
                    const { clientHeight, height, paddingTop, paddingBottom, includePadding } = element.UITools.initialStyles;
                    const { size, padStart, padEnd } = this.test(val, clientHeight, height, paddingTop, paddingBottom, includePadding);

                    element.style.height = size;
                    element.style.paddingTop = padStart;
                    element.style.paddingBottom = padEnd;
                    return;
                }

                if (key === 'active') return;

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