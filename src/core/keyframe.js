import { DEFAULT_UNIT, UNITLESS } from './globals';
import AnimationQueue from './queue';
import { originToStyle, sanitize, toLength, toString } from './utils/convert';
import { isObject } from './utils/helper';

export default class Keyframe {

    constructor({ duration = 0, interpolate = 'ease', origin = { x: 0.5, y: 0.5 }, useLayout = false, ...properties } = {}) {
        this.style = properties;
        this.start = {};
        this.end = {};

        this.duration = duration;
        this.interpolate = interpolate === 'spring' ? 'cubic-bezier(0.65, 0.34, 0.7, 1.42)' : interpolate;
        this.origin = originToStyle(origin);
        this.useLayout = useLayout;
    }

    addProperty(prop, val) {
        if (!isObject(val) || !('start' in val || 'end' in val || 'set' in val)) return this.style[prop] = val;

        if ('start' in val) this.start[prop] = val.start;
        if ('end' in val) this.end[prop] = val.end;
        if ('set' in val) this.style[prop] = val.set;
    }

    compile() {
        this.style = this.interpret(this.style);
        this.start = this.interpret(this.start);
        this.end = this.interpret(this.end);

        return this;
    }

    interpret(properties) {
        if (!Object.keys(properties).length) return null;

        const style = { transform: '' };

        for (const key in properties) {
            let val = properties[key];
            if (val instanceof Function) {
                if ((val = val()) === null) continue;
                val = sanitize(key, val);
            }

            switch (key) {
                case 'position':
                    style.transform += `translate(${toString(val.x, 'px')}, ${toString(val.y, 'px')}) `;
                    break;
                case 'scale':
                    if (typeof val === 'number') val = { x: val, y: val };

                    if (this.useLayout) {
                        style.width = toLength(val.x);
                        style.height = toLength(val.y);
                        break;
                    }

                    style.transform += `scale(${toString(val.x, '%')}, ${toString(val.y, '%')}) `;
                    break;
                case 'rotation':
                    style.transform += `rotate(${toString(val, 'deg')}) `;
                    break;
                case 'clip':
                    style.clipPath = `inset(${toString(val.top, '%')} ${toString(val.right, '%')} ${toString(val.bottom, '%')} ${toString(val.left, '%')})`;
                    style.webkitClipPath = style.clipPath;
                    break;
                case 'interact':
                    style.pointerEvents = val ? 'all' : 'none';
                    break;
                case 'active':
                    style.display = val ? '' : 'none';
                    break;
                case 'strokeLength':
                    style.strokeDashoffset = 1 - val;
                    break;
                default:
                    if (isObject(val) && 'r' in val) {
                        style[key] = `rgba(${val.r}, ${val.g}, ${val.b}, ${val.a})`;
                    } else
                        if (UNITLESS.includes(key)) {
                            style[key] = val;
                        } else {
                            style[key] = toString(val, DEFAULT_UNIT);
                        }

            }
        }

        return style;
    }

    initial(element) {
        element.style.transitionTimingFunction = this.interpolate;
        element.style.transformOrigin = this.origin;

        this.apply(element, { duration: 0 });
    }

    apply(element, { duration = this.duration, reverse = false } = {}) {
        const set = Keyframe.setStyle.bind(Keyframe, element, this.style, duration);

        if (this[reverse ? 'end' : 'start']) {
            Keyframe.setStyle(element, this[reverse ? 'end' : 'start'], 0);
            AnimationQueue.delay(set, 0.001);
        } else {
            set();
        }

        if (this[reverse ? 'start' : 'end']) {
            AnimationQueue.delay(Keyframe.setStyle.bind(Keyframe, element, this[reverse ? 'start' : 'end'], 0), duration, element.Lively.timeouts);
        }
    }

    update(element) {
        element.style.transitionTimingFunction = this.interpolate;
        element.style.transformOrigin = this.origin;

        const style = this.interpret(this.style);
        if (style) Keyframe.setStyle(element, style, this.duration);
    }

    static setStyle(element, style = {}, transition = 0) {
        element.style.transitionDuration = `${transition}s`;

        for (const key in style) {
            if (key === 'width') {
                this.setLength(element, style, 'width', 'paddingLeft', 'paddingRight');
                continue;
            }
            if (key === 'height') {
                this.setLength(element, style, 'height', 'paddingTop', 'paddingBottom');
                continue;
            }
            if ((key === 'padding' && (style.width || style.height)) || key === 'start' || key === 'end') continue;

            element.style[key] = style[key];
        }
    }

    static setLength(element, keyframe, axis, padStart, padEnd) {
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

}