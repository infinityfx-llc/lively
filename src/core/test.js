import { Children, cloneElement, Component, isValidElement, useEffect } from "react";

const is = {
    null: val => typeof val === 'undefined' || val === null,
    array: val => Array.isArray(val),
    object: val => !is.null(val) && typeof val === 'object' && !is.array(val),
    function: val => val instanceof Function,
    string: val => typeof val === 'string',
    bool: val => typeof val === 'boolean',
    number: val => typeof val === 'number'
};

const utils = {
    hasKeys: (obj, n) => Object.keys(obj).length === n,
    isEmpty: obj => utils.hasKeys(obj, 0),
    hasSomeKey: (obj, keys) => Object.keys(obj).some(val => keys.includes(val)),
    xor: (a, b) => (a && !b) || (!a && b),
    hexToRgba: hex => {
        const [_, r, g, b, a] = hex.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i);

        return {
            r: parseInt(r.padStart(2, r), 16),
            g: parseInt(g.padStart(2, g), 16),
            b: parseInt(b.padStart(2, b), 16),
            a: a !== undefined ? parseInt(a, 16) : 255,
        };
    },
    strToRgba: str => {
        const [_, r, g, b, a] = str.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i);

        return {
            r: parseInt(r),
            g: parseInt(g),
            b: parseInt(b),
            a: a !== undefined ? parseInt(a) : 255,
        };
    },
    objToStr: (val, order = Object.keys(val)) => order.map(key => val[key].join('')).join(', '),
    originToStr: origin => {
        let { x, y } = is.object(origin) ? origin : { x: 0.5, y: 0.5 };

        if (is.string(origin)) {
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
        }

        return `${x * 100}% ${y * 100}%`;
    },
    styleToArr: style => {
        const val = style.toString().match(/^([\d.]+)([^\d.]*)$/i);
        if (!val) return [style, null];

        return [parseFloat(val[1]), val[2]];
    },
    getProperty: (el, prop) => {
        const styles = getComputedStyle(el);

        for (const value of styles.transform.matchAll(/(\w+)\(([^)]+)\)/gi)) {
            const [_, type, val] = value;
            const obj = val.split(', ').reduce((obj, val, i) => (obj[['x', 'y', 'z'][i]] = utils.styleToArr(val), obj), {});
            if (prop === type) return utils.hasKeys(obj, 1) ? obj.x : obj;
        }

        return utils.styleToArr(styles[prop]);
    },
    mergeObjects: (a, b, keys = Object.keys(b)) => {
        for (const key of keys) {
            if (!is.null(b[key])) a[key] = b[key];
        }

        return a;
    },
    mergeProperties: (aggregate, props) => {
        for (const prop in props) {
            aggregate[prop] = prop in aggregate ? utils.merge(aggregate[prop], props[prop]) : props[prop];
        }
    },
    merge: (a, b) => {
        if (is.object(a)) {
            const object = {};
            for (const key in a) object[key] = utils.merge(a[key], b[key]);
            return object;
        }

        return [a[0] + b[0], a[1]];
    },
    inViewport: (boundingBox, margin = 0) => {
        const { y, bottom } = boundingBox;
        const h = bottom - y;

        return {
            left: y > window.innerHeight + h * margin,
            entered: y + h * margin < window.innerHeight
        };
    },
    isVisible: el => {
        const { x, y, right, bottom } = el.getBoundingClientRect();
        const w = right - x;
        const h = bottom - y;
        if (w < 1 || h < 1) return false;

        return y < window.innerHeight && bottom > 0 && x < window.innerWidth && right > 0;
    },
    debounce: (cb, ms = 250) => {
        return () => {
            clearTimeout(cb.LivelyTimeout);

            cb.LivelyTimeout = setTimeout(cb, ms);
        };
    },
    throttle: (cb, ms = 250) => {
        return () => {
            const t = Date.now();
            if (cb.LivelyTimestamp - t < ms) return;
            cb.LivelyTimestamp = t;

            cb();
        };
    },
    events: {},
    addEventListener: (event, callback) => {
        if (!(event in utils.events)) {
            utils.events[event] = { unique: 0 };

            window.addEventListener(event, e => {
                for (const cb of Object.values(utils.events[event])) {
                    if (is.function(cb)) cb(e);
                }
            });
        }

        const e = utils.events[event];
        callback.LivelyID = e.unique;
        e[e.unique++] = callback;
    },
    removeEventListener: (event, callback) => {
        if (is.null(window) || !(event in utils.events) || is.null(callback) || !('LivelyID' in callback)) return;

        delete utils.events[event][callback.LivelyID];
    },
    onAny: (events, elements, callback) => { // OPTIMIZE
        for (const event of events) {
            for (const el of elements) el.addEventListener(event, callback);
        }
    },
    offAny: (events, elements, callback) => { // OPTIMIZE
        for (const event of events) {
            for (const el of elements) el.removeEventListener(event, callback);
        }
    }
}

const globals = {
    positions: ['set', 'start', 'end'],
    units: ['%', 'px', 'em', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'deg', 'rad'],
    unitless: ['opacity', 'active', 'interact', 'zIndex', 'lineHeight', 'fontWeight', 'length'],
    parsable_objects: [
        ['x', 'y'], // might need z for 3d transforms
        ['r', 'g', 'b', 'a'],
        ['left', 'top', 'right', 'bottom']
    ],
    transforms: ['translate', 'scale', 'rotate', 'skew'], // this is also apply order (maybe allow custom order)
    defaults: {
        translate: { x: [0, 'px'], y: [0, 'px'] },
        scale: { x: [100, '%'], y: [100, '%'] },
        clip: { left: [0, '%'], top: [0, '%'], right: [0, '%'], bottom: [0, '%'] },
        r: [127, null],
        g: [127, null],
        b: [127, null],
        a: [255, null]
    }
}

const unit = {
    emtopx: (val, el = document.body) => val * parseFloat(getComputedStyle(el).fontSize),
    remtopx: val => unitConversion.emtopx(val),
    vwtopx: val => val * window.innerWidth,
    vhtopx: val => val * window.innerHeight,
    vmintopx: val => val * Math.min(window.innerWidth, window.innerHeight),
    vmaxtopx: val => val * Math.max(window.innerWidth, window.innerHeight),
    radtodeg: val => val * 180 / Math.PI,
    fromProperty: prop => {
        if (['rotate', 'skew'].includes(prop)) return 'deg';
        if (['clip', 'scale'].includes(prop)) return '%';
        if (globals.unitless.includes(prop)) return null;

        return 'px';
    },
    toBase: (val, prop, el) => {
        if (is.object(val)) {
            const object = {};
            for (const key in val) object[key] = unit.toBase(val[key], prop);

            return object;
        }

        const newUnit = unit.fromProperty(prop);
        const key = `${val[1]}to${newUnit}`;
        if (is.null(val[1]) && !is.null(newUnit)) return [val[0], newUnit]; // NOT FULLY CORRECT (keep into account string values that have no unit)

        if (!(key in unit)) return val;

        const num = unit[key](val[0], el);

        return [num, newUnit];
    },
    normalize: (u, prop) => {
        if (is.null(u) && globals.unitless.includes(prop)) return u;
        if (globals.units.includes(u)) return u;

        return unit.fromProperty(prop);
    }
}

const interpolation = {
    interpolate: (a, b, t, func) => {
        if (is.object(a)) {
            const object = {};
            for (const key in a) object[key] = interpolation.interpolate(a[key], b[key], t, func);

            return object;
        }

        return [func(a[0], b[0], t), a[1]];
    },
    constant: val => val,
    linear: (a, b, t) => {
        if (!is.number(a) || !is.number(b)) return t > .5 ? b : a;

        return a * (1 - t) + b * t;
    },
    ease: (a, b, t) => {
        return interpolation.linear(a, b, (1 - Math.cos(t * Math.PI)) / 2);
    },
    spring: (a, b, t) => {
        const amplitude = 1;
        const frequency = 2.5;
        const decay = 3.6;

        t = 1 - amplitude * Math.exp(-decay * t) * Math.cos(frequency * Math.pow(t, 2) * Math.PI);
        return interpolation.linear(a, b, t);
    }
}

const Link = { // Allow for interpolation as well
    create: (initial) => {
        const state = { value: initial, transform: val => val, duration: 0 }; // duration WIP

        const link = function (args) {
            if (is.function(args)) return state.transform = args, link;

            return state.transform(state.value);
        };
    
        link.set = (val, duration = 0) => {
            state.value = val;
            state.duration = duration;
        };
    
        return link;
    },
    isInstance: val => is.function(val) && is.function(val.set)
}

export function useLink(initial) {
    const link = Link.create(initial);

    return [link, link.set];
}

export function useScroll() {
    const link = Link.create(0);

    useEffect(() => {
        const set = () => link.set(window.scrollY);
        set();

        utils.addEventListener('scroll', set);
        return () => utils.removeEventListener('scroll', set);
    }, []);

    return link;
}

class Clip {

    constructor({ duration = 1, delay, repeat, alternate, origin = { x: 0.5, y: 0.5 }, ...properties } = {}, initial = {}) {
        this.duration = duration;
        this.origin = utils.originToStr(origin); // APPLY THIS SOMEWHERE!

        this.initial = initial;
        this.initials = { ...initial }; // OPTIMIZE
        this.channel = new Channel(this.convert.bind(this)); // OPTIMIZE

        this.properties = this.parse(properties);
        this.isEmpty = utils.isEmpty(this.properties);

        this.defaults = { delay, repeat, alternate };
    }

    length() {
        return this.duration * (this.defaults.repeat || 1) + (this.defaults.delay || 0);
    }

    parse(properties) {
        for (const prop in properties) {
            let val = properties[prop];

            if (Link.isInstance(val)) {
                this.channel.add(prop, val);
                delete properties[prop];
                continue;
            }

            if (is.function(val)) continue;

            val = is.array(val) ? val : [val];
            val.length < 2 ? val.unshift(prop in this.initial ? this.initial[prop] : null) : this.initials[prop] = val[0];

            const arr = val.map(val => this.sanitize(val, prop));
            for (let i = 0; i < arr.length; i++) this.quantize(arr, i);

            properties[prop] = arr;
        }

        for (const prop in this.initials) this.initials[prop] = this.convert(this.initials[prop], prop);

        return properties;
    }

    sanitize(val, prop) {
        if (!is.object(val)) val = { set: val };

        if (!utils.hasSomeKey(val, globals.positions)) val = { set: val };
        if (!('set' in val)) val.set = 'start' in val ? val.start : val.end;
        if ('time' in val && val.time > this.duration) delete val.time;

        val = { ...val }; // CHECK
        for (const key of globals.positions) {
            if (key in val) val[key] = this.convert(val[key], prop);
        }

        return val;
    }

    quantize(keys, i, l = i - 1) {
        if ('time' in keys[i]) return keys[i].time;
        if (i == 0 || i == keys.length - 1) return keys[i].time = i == 0 ? 0 : this.duration;

        const low = this.quantize(keys, l, l);
        return keys[i].time = low + (this.quantize(keys, i + 1, l) - low) * ((i - l) / (i - l + 1));
    }

    convert(val, prop) {
        if (is.null(val)) return prop in this.initial ? this.convert(this.initial[prop], prop) : null;

        if (is.object(val)) {
            let keys = Object.keys(val);

            for (const arr of globals.parsable_objects) {
                if (utils.hasSomeKey(val, arr)) {
                    keys = arr;
                    break;
                }
            }

            val = { ...val }; // CHECK
            for (const key of keys) {
                const def = prop in globals.defaults ? globals.defaults[prop][key] : globals.defaults[key];
                val[key] = key in val ? this.convert(val[key]) : def;
            }

            return val;
        }

        let u;
        if (is.string(val)) {
            if (val.match(/^#[0-9a-f]{3,8}$/i)) return utils.hexToRgba(val);
            if (val.match(/^rgba?\(.*\)$/i)) return utils.strToRgba(val);

            [val, u] = utils.styleToArr(val);
            if (!u) return [val, u];
        }

        u = unit.normalize(u, prop);

        return [val, u];
    }

    play(options = {}) {
        return new Track(this, utils.mergeObjects(options, this.defaults));
    }

}

class Track {

    constructor(clip, { reverse = false, repeat = 1, delay = 0, alternate = false } = {}) {
        this.indices = {};
        this.clip = clip;
        this.t = 0;
        this.T = clip.duration * repeat + delay;

        this.reverse = reverse;
        this.delay = delay;
        this.alternate = alternate;

        // this.ended = new Promise(); // WIP

        // events: onend, onpause, onplay
    }

    get(element) {
        let t = this.t - this.delay;
        const isAlt = this.alternate && Math.floor(t / this.clip.duration) % 2 == 1;
        t = t % this.clip.duration;
        t = utils.xor(this.reverse, isAlt) ? this.clip.duration - t : t;

        const properties = {};

        if (this.t >= this.delay) {
            for (const prop in this.clip.properties) {
                let val = this.clip.properties[prop];

                if (is.function(val)) {
                    val = this.clip.convert(val(t, this.clip.duration), prop);
                    val = unit.toBase(val, prop, element);
                } else {
                    if (!(prop in this.indices)) this.indices[prop] = this.reverse ? val.length - 1 : 0; // reset indices when end of animation (maybe?)

                    const inc = this.reverse ? -1 : 1;
                    let i = this.indices[prop];

                    let from = val[i];
                    let to = val[i + inc];
                    let mainVal = from.set, isMarker;

                    if (this.reverse ? to.time >= t : to.time <= t) {
                        this.indices[prop] = i = i + inc;

                        const keys = ['start', 'end'];
                        const s = keys[+!this.reverse], e = keys[+this.reverse];
                        if (s in from || e in to) {
                            mainVal = s in from ? from[s] : to[e];
                            isMarker = true;
                        } else {
                            from = val[i];
                            to = val[i + inc];
                        }
                    }

                    if (is.null(mainVal)) mainVal = utils.getProperty(element, prop);
                    mainVal = unit.toBase(mainVal, prop, element);

                    if (isMarker) {
                        val = unit.toBase(mainVal, prop, element);
                    } else {
                        let scndVal = is.null(to.set) ? utils.getProperty(element, prop) : to.set;
                        scndVal = unit.toBase(scndVal, prop, element);

                        const func = interpolation[to.interpolate] || interpolation.linear;
                        val = interpolation.interpolate(mainVal, scndVal, (t - from.time) / (to.time - from.time), func);
                    }
                }

                properties[prop] = val;
            }
        }

        return properties;
    }

    step(dt) {
        this.t += dt;

        return this.t >= this.T;
    }

}

class Channel extends Track {

    constructor(convert) {
        super({
            duration: Infinity,
            properties: {},
            convert
        });

        // this.previous = {};
    }

    add(prop, link) {
        this.clip.properties[prop] = link;
    }

    // get(element) {
    //     const properties = {};

    //     for (const prop in this.clip.properties) {
    //         let val = this.clip.properties[prop];
    //         let scndVal = this.previous[prop] || { value: null, t: 0 };
    //         const t = (this.t - scndVal.t) / val.duration;

    //         const func = interpolation.linear; //interpolation[to.interpolate] || interpolation.linear;

    //         val = this.clip.convert(val(t, this.clip.duration), prop);
    //         val = unit.toBase(val, prop, element);

    //         if (is.null(scndVal.value)) scndVal = unit.toBase(utils.getProperty(element, prop), prop, element);

    //         properties[prop] = interpolation.interpolate(scndVal, val, t, func);

    //         this.previous[prop] = { value: val, t: this.t };
    //     }

    //     return properties;
    // }

}

class Timeline {

    constructor(element, useCulling = true) {
        this.element = element;
        this.tracks = [];
        this.queue = [];

        this.playing = true;
        this.culling = useCulling;
    }

    purge() {
        this.element.style = {};
        this.element.style.strokeDasharray = 1;
    }

    clear() {
        this.tracks = [];
        this.queue = [];
    }

    add(track, { immediate = false, composite = true } = {}) {
        if (immediate) this.clear();

        composite || !this.tracks.length ? this.tracks.push(track) : this.queue.push(track);
    }

    remove(track) {
        this.tracks.splice(this.tracks.indexOf(track), 1);

        if (!this.tracks.length && this.queue.length) this.tracks.push(this.queue.shift());
    }

    step(dt) {
        if (!this.playing) return;

        let props = {};
        for (let i = 0; i < this.tracks.length + 1; i++) {
            const track = this.tracks[i] || this.channel;
            if (track && (!this.culling || utils.isVisible(this.element))) utils.mergeProperties(props, track.get(this.element));

            if (track.step(dt)) this.remove(track);
        }

        this.apply(this.element, props);
    }

    apply(el, properties) {
        if (utils.isEmpty(properties)) return;

        const transform = [];

        for (const prop in properties) {
            let val = properties[prop];

            if (prop === 'length') { // OPTIMIZE
                el.style.strokeDashoffset = 1 - val[0];
            } else
                if (prop === 'active') {
                    el.style.display = val[0] ? '' : 'none';
                } else
                    if (prop === 'interact') {
                        el.style.pointerEvents = val[0] ? 'all' : 'none';
                    } else
                        if (prop === 'clip') {
                            el.style.clipPath = `inset(${utils.objToStr(val, ['top', 'right', 'bottom', 'left'])})`;
                            el.style.webkitClipPath = el.style.clipPath;
                        } else
                            if (globals.transforms.includes(prop)) {
                                val = is.object(val) ? `${prop}(${utils.objToStr(val, ['x', 'y'])})` : `${prop}(${val.join('')})`;

                                transform.push(val); // use aliases (and maybe allow for 3d transforms)
                            } else
                                if (is.object(val) && 'r' in val) {
                                    el.style[prop] = `rgba(${val.r[0]}, ${val.g[0]}, ${val.b[0]}, ${val.a[0]})`;
                                } else {
                                    el.style[prop] = is.null(val[1]) ? val[0] : val[0] + val[1];
                                }
        }

        if (transform.length) el.style.transform = transform.join(' ');
    }

    initialize(clip) {
        this.apply(this.element, clip.initials);

        this.channel = clip.channel; // Maybe allow for array of channels?
    }

}

class AnimationManager {

    constructor(stagger, useCulling) {
        this.targets = [];

        this.stagger = stagger;
        this.useCulling = useCulling;
    }

    register() {
        Lively.get().add(this);
    }

    destroy() {
        this.targets = [];

        Lively.get().remove(this);
    }

    purge() {
        for (const target of this.targets) target.purge();
    }

    clear() {
        for (const target of this.targets) target.clear();
    }

    set(elements) {
        this.targets = elements.map(el => new Timeline(el, this.useCulling));
    }

    play(clip, options) {
        for (let i = 0; i < this.targets.length; i++) {
            options.delay = (options.delay || 0) + i * this.stagger;

            if (clip.isEmpty) continue;
            this.targets[i].add(clip.play(options), options);
        }
    }

    initialize(clip) {
        for (const target of this.targets) target.initialize(clip);

        // init reactive values here
    }

    step(dt) {
        for (const target of this.targets) target.step(dt);
    }

}

class Lively {

    constructor() {
        this.t = Date.now();
        this.managers = [];

        this.step();
    }

    static get() {
        if (!window.Lively) window.Lively = new Lively();

        return window.Lively;
    }

    step() {
        const t = Date.now();

        for (const manager of this.managers) manager.step((t - this.t) / 1000);

        this.t = t;
        requestAnimationFrame(this.step.bind(this));
    }

    add(manager) {
        this.managers.push(manager);
    }

    remove(manager) {
        this.managers.splice(this.managers.indexOf(manager), 1);
    }

}

export class AnimatableTest extends Component {

    static isInstance(val) {
        return val.type === AnimatableTest || val.type.prototype instanceof AnimatableTest;
    }

    static events = ['click', 'mouseenter', 'mouseleave', 'focus', 'blur'];

    constructor(props) {
        super(props);

        this.animations = { default: this.parse(this.props.animate) };
        for (const key in this.props.animations) {
            this.animations[key] = this.parse(this.props.animations[key]);
        }

        this.children = [];
        this.elements = [];
        this.manager = new AnimationManager(this.props.stagger, this.props.lazy);
    }

    parse(properties) {
        if (!is.object(properties)) return null;

        return new Clip(properties, this.props.initial);
    }

    update() {
        this.manager.purge();
        this.manager.initialize(this.animations.default); // look into doing this on server render in react component (also implement restoring of current keyframe)
    }

    componentDidMount() {
        this.resizeEventListener = utils.debounce(this.update.bind(this));
        utils.addEventListener('resize', this.resizeEventListener);
        this.scrollEventListener = utils.throttle(this.onScroll.bind(this));
        utils.addEventListener('scroll', this.scrollEventListener);

        this.eventListener = this.onEvent.bind(this); // NOT SURE (BUT TODO)
        utils.onAny(AnimatableTest.events, this.elements, this.eventListener);

        this.manager.set(this.elements);
        this.manager.register();
        this.update();

        document.fonts.ready.then(() => {
            this.update();
            this.manager.clear();
            this.inViewport = false;

            if (!this.props.group) {
                this.play(this.props.onMount);
                this.onScroll();
            }
        });
    }

    componentWillUnmount() {
        utils.removeEventListener('resize', this.resizeEventListener);
        utils.removeEventListener('scroll', this.scrollEventListener);

        utils.offAny(AnimatableTest.events, this.elements, this.eventListener);

        this.manager.destroy();
    }

    dispatch(e) {
        if (is.function(this.props[e])) this.props[e]();
    }

    onEvent({ type }) {
        switch (type) {
            case 'click':
                this.play(this.props.onClick);
                break;
            case 'mouseenter':
                if (!this.hover) this.hover = true, this.play(this.props.whileHover);
                break;
            case 'mouseleave':
                if (this.hover) this.hover = false, this.play(this.props.whileHover, { reverse: true });
                break;
            case 'focus':
                if (!this.focus) this.focus = true, this.play(this.props.whileFocus);
                break;
            case 'blur':
                if (this.focus) this.focus = false, this.play(this.props.whileFocus, { reverse: true });
                break;
        }
    }

    getBoundingBox() {
        const bounds = { x: Number.MAX_VALUE, y: Number.MAX_VALUE, right: 0, bottom: 0 };

        const arr = this.elements.length ? this.elements : this.children;
        for (const el of arr) {
            const box = this.elements.length ? el.getBoundingClientRect() : el.getBoundingBox();

            bounds.y = Math.min(box.y, bounds.y);
            bounds.x = Math.min(box.x, bounds.x);
            bounds.right = Math.max(box.right, bounds.right);
            bounds.bottom = Math.max(box.bottom, bounds.bottom);
        }

        return bounds;
    }

    onScroll() {
        if (!this.props.whileViewport) return;

        const { entered, left } = utils.inViewport(this.getBoundingBox(), this.props.viewportMargin);

        if (entered && !this.inViewport) {
            this.inViewport = true;
            this.play(this.props.whileViewport);
            this.dispatch('onEnterViewport');
        }

        if (left && this.inViewport) {
            this.inViewport = false;
            this.play(this.props.whileViewport, { reverse: true, immediate: true });
            this.dispatch('onLeaveViewport');
        }
    }

    play(animation, { reverse = false, composite = false, immediate = false, delay = 0 } = {}, cascade = false) {
        if (!animation || this.props.disabled || (this.props.group > 0 && !cascade)) return;
        if (!is.string(animation)) animation = 'default';

        this.dispatch('onAnimationStart');
        const clip = this.animations[animation];
        const duration = clip.length() + delay; // THIS IS NOT CORRECT don't include + delay in reverse terms

        // also implement stagger for direct animatable children
        let parentDelay = 0;
        for (const child of this.children) {
            parentDelay = Math.max(parentDelay, child.play(animation, { reverse, immediate, delay: child.props.group * duration }, true));
        }

        this.manager.play(clip, { reverse, composite, immediate, delay: reverse ? parentDelay : delay });

        // this.dispatch('onAnimationEnd');
        return duration + (reverse ? parentDelay : 0);
    }

    pause() {}

    stop() {} // MAYBE?

    prerender(children, level = 0, domLevel = 0) {
        return Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            const props = { pathLength: 1 };

            isAnimatable: if (AnimatableTest.isInstance(child)) {
                if (this.props.group > 0 || child.props.noCascade) break isAnimatable;

                props.group = ++level;

                const i = this.childIndex++;
                props.ref = el => this.children[i] = el;
                utils.mergeObjects(props, this.props, ['animate', 'initial', 'animations', 'stagger']);
            } else
                if (!domLevel) props.ref = el => this.elements[i] = el;

            return cloneElement(child, props, this.prerender(child.props.children, level, domLevel + 1));
        });
    }

    render() {
        this.childIndex = 0;

        return this.prerender(this.props.children);
    }

    static defaultProps = {
        group: 0,
        stagger: 0.1,
        viewportMargin: 0.75,
        lazy: true,
        animate: {},
        animations: {}
    }

}