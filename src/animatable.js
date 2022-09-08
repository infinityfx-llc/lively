// import React, { Children, cloneElement, Component, isValidElement } from 'react';
// import Animation from './animations/animation';
// import AnimationClip from './core/animation-clip';
// import Keyframe from './core/keyframe';
// import Link from './core/link';
// import AnimationQueue from './core/queue';
// import { addEventListener, cacheElementStyles, isObject, removeEventListener } from './core/utils/helper';

// useReducedMotion
// allow for links to be used in objects such as link per scale component { x: link, y: link }
// allow for functions as animation value
// change up keyframes to include duration/time property
// disabled property for animatable components

// export default class Animatable extends Component {

//     constructor(props) {
//         super(props);

//         this.hover = false;
//         this.hasFocus = false;
//         this.inView = false;
//         this.scrollDelta = 0;
//         this.viewportMargin = props.viewportMargin;

//         const { duration, interpolate, origin, useLayout } = this.props.animate || {}; //OPTIMIZE
//         this.links = { duration, interpolate, origin, useLayout }; //OPTIMIZE

//         this.animations = { default: this.parse(this.props.animate) };
//         for (const key in this.props.animations) {
//             this.animations[key] = this.parse(this.props.animations[key]);
//         }

//         this.links = new Keyframe(this.links);

//         this.elements = [];
//         this.children = [];
//         this.level = 0;
//     }

//     parse(properties) {
//         if (Animation.isAnimation(properties)) return properties.use();
//         if (!isObject(properties)) return null;

//         const props = {};
//         for (const prop in properties) {
//             const val = properties[prop];
//             if (Link.isLink(val)) {
//                 this.links[prop] = val.link(this.style.bind(this));
//                 continue;
//             }

//             props[prop] = val;
//         }

//         return new AnimationClip(props, this.props.initial);
//     }

//     style() {
//         cancelAnimationFrame(this.frame);

//         this.frame = requestAnimationFrame(() => {
//             for (const el of this.elements) {
//                 this.links.update(el);
//             }
//         });
//     }

//     update() {
//         for (const el of this.elements) {
//             cacheElementStyles(el); // get previous cached styles and transition between the 2

//             this.animations.default.restore(el, true);
//             this.links.update(el);
//         }

//         // animate on children that have just mounted
//         // if ((this.props.parentLevel < 1 || this.props.noCascade) && this.props.onMount) this.play(this.props.onMount, { staggerDelay: 0.001, immediate: true });
//     }

//     componentDidMount() {
//         const isParent = this.props.parentLevel < 1 || this.props.noCascade;
//         this.resizeEventListener = this.onResize.bind(this);
//         addEventListener('resize', this.resizeEventListener);
//         if (isParent) {
//             this.scrollEventListener = this.onScroll.bind(this);
//             addEventListener('scroll', this.scrollEventListener);
//         }

//         this.update();

//         (async () => {
//             if ('fonts' in document) {
//                 await document.fonts.ready;
//                 this.update({ mount: true });
//             }

//             if (isParent) {
//                 if (this.props.onMount) this.play(this.props.onMount, { staggerDelay: 0.001, immediate: true });
//                 AnimationQueue.delay(() => this.onScroll(), 0.001);
//             }
//         })();
//     }

//     async componentDidUpdate() {
//         this.update(); //maybe use mount = true
//     }

//     componentWillUnmount() {
//         removeEventListener('scroll', this.scrollEventListener);
//         removeEventListener('resize', this.resizeEventListener);
//     }

//     inViewport() {
//         let entered = true, left = true;

//         for (const el of this.elements) {
//             const { y } = el.getBoundingClientRect();
//             entered = entered && y + el.clientHeight * this.viewportMargin < window.innerHeight;
//             left = left && y > window.innerHeight + el.clientHeight * (1 - this.viewportMargin);
//         }

//         if (!this.elements.length) {
//             for (const { animatable } of this.children) {
//                 const [nestedEntered, nestedLeft] = animatable.inViewport();
//                 entered = entered && nestedEntered;
//                 left = left && nestedLeft;
//             }
//         }

//         return [entered, left];
//     }

//     async onScroll() {
//         if (!this.props.whileViewport || Date.now() - this.scrollDelta < 350) return;
//         this.scrollDelta = Date.now();

//         let [entered, left] = this.inViewport();

//         if (!this.inView && entered) {
//             this.inView = true;
//             if (this.props.whileViewport) this.play(this.props.whileViewport);
//             this.props.onEnterViewport?.();
//         }

//         if (this.inView && left) {
//             this.inView = false;
//             if (this.props.whileViewport) this.play(this.props.whileViewport, { reverse: true, immediate: true });
//             this.props.onLeaveViewport?.();
//         }
//     }

//     async onResize() {
//         if (this.nextResize?.cancel) this.nextResize.cancel();

//         this.nextResize = AnimationQueue.delay(this.update.bind(this, { mount: true }), 0.25);
//     }

//     async onEnter(e, callback = false) {
//         if (!this.hover) {
//             if (this.props.whileHover) this.play(this.props.whileHover);
//             this.hover = true;
//         }

//         if (callback) callback(e);
//     }

//     async onLeave(e, callback = false) {
//         if (this.hover) {
//             if (this.props.whileHover) this.play(this.props.whileHover, { reverse: true });
//             this.hover = false;
//         }

//         if (callback) callback(e);
//     }

//     async onFocus(e, callback = false) {
//         if (!this.hasFocus) {
//             if (this.props.whileFocus) this.play(this.props.whileFocus);
//             this.hasFocus = true;
//         }

//         if (callback) callback(e);
//     }

//     async onBlur(e, callback = false) {
//         if (this.hasFocus) {
//             if (this.props.whileFocus) this.play(this.props.whileFocus, { reverse: true });
//             this.hasFocus = false;
//         }

//         if (callback) callback(e);
//     }

//     async onClick(e, callback = false) {
//         if (this.props.onClick) this.play(this.props.onClick);

//         if (callback) callback(e);
//     }

//     async play(animationName, { callback, reverse = false, immediate = false, cascade = false, groupAdjust = 0, cascadeDelay = 0, staggerDelay = 0 } = {}) {
//         if (this.props.parentLevel > 0 && !cascade) return;

//         const animation = typeof animationName === 'string' ? this.animations[animationName] : this.animations.default;
//         if (!animation) return;
//         this.props.onAnimationStart?.();

//         let aggregate_delay = 0;
//         for (let i = 0; i < this.elements.length; i++) {
//             let offset = 'group' in this.props ? this.props.parentLevel - this.props.group : this.level + groupAdjust;
//             // NOT FULLY CORRECT (also take into account reverse staggering)
//             let delay = reverse ? offset * animation.duration : (this.props.parentLevel - offset) * cascadeDelay;
//             delay = this.props.stagger * i + delay + staggerDelay;
//             aggregate_delay = Math.max(delay, aggregate_delay);

//             animation.play(this.elements[i], {
//                 delay,
//                 reverse,
//                 immediate
//             });
//         };

//         for (const { animatable, staggerIndex } of this.children) {
//             animatable.play(animationName, {
//                 reverse,
//                 immediate,
//                 cascade: true,
//                 staggerDelay: staggerIndex < 0 ? 0 : this.props.stagger * staggerIndex,
//                 cascadeDelay: animation.duration,
//                 groupAdjust: staggerIndex < 0 ? 0 : 1
//             });
//         }

//         AnimationQueue.delay(() => {
//             callback?.();
//             this.props.onAnimationEnd?.();
//         }, aggregate_delay + animation.duration);
//     }

//     mergeProperties(own = {}, passed = {}) {
//         const merged = { ...passed, ...own };

//         for (const key in merged) {
//             if (['children', 'parentLevel', 'ref'].includes(key)) {
//                 delete merged[key];
//                 continue;
//             }
//             if (Array.isArray(own[key]) || Array.isArray(passed[key])) continue;
//             if (typeof own[key] === 'object' && typeof passed[key] === 'object') merged[key] = { ...passed[key], ...own[key] };
//         }

//         return merged;
//     }

//     deepClone(component, { index = 0, useElements = false, useEvents = true } = {}) {
//         if (!isValidElement(component)) return component;

//         let props = { pathLength: 1 };
//         if (component.type !== Animatable && !(component.type.prototype instanceof Animatable)) {
//             if (useElements) props = { ...props, ref: el => this.elements[index] = el };

//             if (useEvents && (this.props.parentLevel < 1 || this.props.noCascade)) {
//                 props = {
//                     ...props,
//                     onMouseEnter: e => this.onEnter(e, component.props?.onMouseEnter),
//                     onMouseLeave: e => this.onLeave(e, component.props?.onMouseLeave),
//                     onFocus: e => this.onFocus(e, component.props?.onFocus),
//                     onBlur: e => this.onBlur(e, component.props?.onBlur),
//                     onClick: e => this.onClick(e, component.props?.onClick)
//                 };
//                 useEvents = false;
//             }
//         }

//         if ((component.type === Animatable || component.type.prototype instanceof Animatable) && !component.props?.noCascade) {
//             const idx = this.childrenIndex++;
//             props = {
//                 ...props,
//                 ...this.mergeProperties(component.props, this.props),
//                 parentLevel: this.parentLevel > 0 ? this.parentLevel : this.level,
//                 ref: el => this.children[idx] = { animatable: el, staggerIndex: useElements ? index : -1 }
//             };
//         }

//         const children = Children.map(component.props.children, (child, i) => this.deepClone(child, { index: i, useEvents }));

//         return cloneElement(component, props, children);
//     }

//     countNestedLevels(children) {
//         if (!children) return 0;

//         let count = 0, nested = 0;
//         Children.forEach(children, (child) => {
//             if (!isValidElement(child)) return;
//             if (child.type === Animatable || child.type.prototype instanceof Animatable) count = 1;

//             const n = this.countNestedLevels(child.props?.children);
//             nested = nested < n ? n : nested;
//         });

//         return nested + count;
//     }

//     render(children = this.props.children) {
//         this.level = this.countNestedLevels(children);

//         this.childrenIndex = 0;
//         return Children.map(children, (child, i) => this.deepClone(child, { index: i, useElements: true }));
//     }

//     static defaultProps = {
//         parentLevel: 0,
//         stagger: 0.1,
//         viewportMargin: 0.75,
//         animate: {},
//         animations: {}
//     }

// }
import { Children, cloneElement, Component, isValidElement } from 'react';
import Clip from './core/clip';
import AnimationManager from './core/manager';
import { addEventListener, offAny, onAny, removeEventListener } from './core/utils/events';
import { debounce, is, mergeObjects, throttle } from './core/utils/helper';

export default class Animatable extends Component {

    static isInstance(val) {
        return val.type === Animatable || val.type.prototype instanceof Animatable;
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
        this.manager.initialize(this.animations.default); // also implement restoring of current keyframe
    }

    componentDidMount() {
        this.resizeEventListener = debounce(this.update.bind(this));
        addEventListener('resize', this.resizeEventListener);
        this.scrollEventListener = throttle(this.onScroll.bind(this));
        addEventListener('scroll', this.scrollEventListener);

        this.eventListener = this.onEvent.bind(this); // NOT SURE (BUT TODO)
        onAny(Animatable.events, this.elements, this.eventListener);

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
        removeEventListener('resize', this.resizeEventListener);
        removeEventListener('scroll', this.scrollEventListener);

        offAny(Animatable.events, this.elements, this.eventListener);

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

        const { entered, left } = is.inViewport(this.getBoundingBox(), this.props.viewportMargin);

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

            isAnimatable: if (Animatable.isInstance(child)) {
                if (this.props.group > 0 || child.props.noCascade) break isAnimatable;

                props.group = ++level;

                const i = this.childIndex++;
                props.ref = el => this.children[i] = el;
                mergeObjects(props, this.props, ['animate', 'initial', 'animations', 'stagger']);
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