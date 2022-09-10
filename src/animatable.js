// useReducedMotion
// allow for links to be used in objects such as link per scale component { x: link, y: link }

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

//     update() {
//         for (const el of this.elements) {
//             cacheElementStyles(el); // get previous cached styles and transition between the 2

//             this.animations.default.restore(el, true);
//             this.links.update(el);
//         }

//         // animate on children that have just mounted
//         // if ((this.props.parentLevel < 1 || this.props.noCascade) && this.props.onMount) this.play(this.props.onMount, { staggerDelay: 0.001, immediate: true });
//     }

//     async componentDidUpdate() {
//         this.update(); //maybe use mount = true
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

// static setStyle(element, style = {}, transition = 0) {
//     element.style.transitionDuration = `${transition}s`;

//     for (const key in style) {
//         if (key === 'width') {
//             this.setLength(element, style, 'width', 'paddingLeft', 'paddingRight');
//             continue;
//         }
//         if (key === 'height') {
//             this.setLength(element, style, 'height', 'paddingTop', 'paddingBottom');
//             continue;
//         }
//         if ((key === 'padding' && (style.width || style.height)) || key === 'start' || key === 'end') continue;

//         element.style[key] = style[key];
//     }
// }

// static setLength(element, keyframe, axis, padStart, padEnd) {
//     const size = element.Lively.initials[axis];
//     const paddingStart = parseInt(element.Lively.initials[padStart]);
//     const paddingEnd = parseInt(element.Lively.initials[padEnd]);
//     let val = keyframe[axis];

//     const ratio = keyframe.padding ? 1 : paddingStart / (paddingEnd === 0 ? 1e-6 : paddingEnd); // OPTIMIZE
//     if (typeof val === 'string') val = `calc(${val} / ${size})`;
//     const padding = keyframe.padding ? keyframe.padding : paddingStart + paddingEnd + 'px';

//     element.style[axis] = `max(calc(${size} * ${val} - ${element.style.boxSizing !== 'border-box' ? '0px' : padding}), 0px)`;
//     const padStyle = `calc(min(calc(${size} * ${val}), ${padding}) * `;
//     element.style[padStart] = padStyle + (ratio * 0.5);
//     element.style[padEnd] = padStyle + (1 / (ratio === 0 ? 1e-6 : ratio) * 0.5); // OPTIMIZE
// }

import { Children, cloneElement, Component, isValidElement } from 'react';
import Clip from './core/clip';
import AnimationManager from './core/manager';
import Animation from './animations/animation';
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
        if (Animation.isInstance(properties)) return properties.use();
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

    componentDidUpdate() {
        // if props.playing changes pause/play animation
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
        const duration = clip.length();

        // also implement stagger for direct animatable children (child.props.group)
        let parentDelay = 0;
        for (const child of this.children) { // maybe implement recursive implementation with children per Animatable, instead of all children belonging to top parent Animatable
            parentDelay = Math.max(parentDelay, child.play(animation, { reverse, immediate, delay: delay + duration }, true));
        }

        this.manager.play(clip, { reverse, composite, immediate, delay: reverse ? parentDelay : delay });

        if (!this.props.group) setTimeout(() => this.dispatch('onAnimationEnd'), ((reverse ? duration : 0) + parentDelay) * 1000); // NOT CORRECT (currently not cancellable, for re-render causes duplicate events)
        return duration + (reverse ? parentDelay : delay);
    }

    stop() {
        this.manager.clear();
    }

    prerender(children, level = 0, domLevel = 0) { // maybe only parse first layer of child Animatable objects per parent (see play implementation)
        return Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            const props = { pathLength: 1 };

            isAnimatable: if (Animatable.isInstance(child)) {
                if (this.props.group > 0 || child.props.noCascade) break isAnimatable;

                props.group = ++level;

                const i = this.childIndex++;
                props.ref = el => this.children[i] = el;
                mergeObjects(props, this.props, ['animate', 'initial', 'animations', 'stagger']); // OPTIMIZE
                mergeObjects(props, child.props, ['animate', 'initial', 'animations', 'stagger']); // OPTIMIZE
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