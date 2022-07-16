import React, { Children, cloneElement, Component, isValidElement } from 'react';
import Animation from './animation';
import AnimationQueue from './queue';
import { addEventListener, cacheElementStyles, removeEventListener } from './utils';

// optimize forEach and Morph component not so many re-renders
// implement on animation end
// parallax, value based animation (progress)
// reactive animation animate based on reactive values / elements
// add support for webkit clip-path

export default class Animatable extends Component {

    constructor(props) {
        super(props);

        this.hover = false;
        this.hasFocus = false;
        this.inView = false;
        this.scrollDelta = 0;
        this.viewportMargin = props.viewportMargin;

        this.animations = { default: this.toAnimation(this.props.animate) };
        for (const key in this.props.animations) {
            this.animations[key] = this.toAnimation(this.props.animations[key]);
        }

        this.elements = [];
        this.children = [];
        this.level = 0;
    }

    update() {
        this.elements.forEach(el => {
            cacheElementStyles(el); // get previous cached styles and transition between the 2

            this.animations.default?.setToLast(el, true);
        });

        // animate on children that have just mounted
        // if ((this.props.parentLevel < 1 || this.props.noCascade) && this.props.onMount) this.play(this.props.onMount, { staggerDelay: 0.001, immediate: true });
    }

    toAnimation(animation) {
        if (!animation || (typeof animation !== 'object' && typeof animation !== 'function')) return null;
        if ('use' in animation) return animation.use();

        return Object.keys(animation).length ? new Animation({ ...animation }, this.props.initial) : null;
    }

    async componentDidMount() {
        this.resizeEventListener = this.onResize.bind(this);
        addEventListener('resize', this.resizeEventListener);

        this.update(true);
        if ('fonts' in document) {
            await document.fonts.ready;
            this.update(true);
        }

        if (this.props.parentLevel < 1 || this.props.noCascade) {
            this.scrollEventListener = this.onScroll.bind(this);
            addEventListener('scroll', this.scrollEventListener);

            if (this.props.onMount) this.play(this.props.onMount, { staggerDelay: 0.001, immediate: true });
            if (this.props.whileViewport) AnimationQueue.delay(() => this.onScroll(), 0.001);
        }
    }

    async componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.scrollEventListener);
        removeEventListener('resize', this.resizeEventListener);
    }

    inViewport() {
        let entered = true, left = true;

        this.elements.forEach(el => {
            const { y } = el.getBoundingClientRect();
            entered = entered && y + el.clientHeight * (1 - this.viewportMargin) < window.innerHeight;
            left = left && y > window.innerHeight + el.clientHeight * this.viewportMargin;
        });

        if (!this.elements.length) {
            for (const { animatable } of this.children) {
                const [nestedEntered, nestedLeft] = animatable.inViewport();
                entered = entered && nestedEntered;
                left = left && nestedLeft;
            }
        }

        return [entered, left];
    }

    async onScroll() {
        if (Date.now() - this.scrollDelta < 350) return;
        this.scrollDelta = Date.now();

        let [entered, left] = this.inViewport();

        if (!this.inView && entered) {
            this.inView = true;
            if (this.props.whileViewport) this.play(this.props.whileViewport);
        }

        if (this.inView && left) {
            this.inView = false;
            if (this.props.whileViewport) this.play(this.props.whileViewport, { reverse: true, immediate: true });
        }
    }

    async onResize() {
        if (this.nextResize?.cancel) this.nextResize.cancel();

        this.nextResize = AnimationQueue.delay(this.update.bind(this), 0.25);
    }

    async onEnter(e, callback = false) {
        if (!this.hover) {
            if (this.props.whileHover) this.play(this.props.whileHover);
            this.hover = true;
        }

        if (callback) callback(e);
    }

    async onLeave(e, callback = false) {
        if (this.hover) {
            if (this.props.whileHover) this.play(this.props.whileHover, { reverse: true });
            this.hover = false;
        }

        if (callback) callback(e);
    }

    async onFocus(e, callback = false) {
        if (!this.hasFocus) {
            if (this.props.whileFocus) this.play(this.props.whileFocus);
            this.hasFocus = true;
        }

        if (callback) callback(e);
    }

    async onBlur(e, callback = false) {
        if (this.hasFocus) {
            if (this.props.whileFocus) this.play(this.props.whileFocus, { reverse: true });
            this.hasFocus = false;
        }

        if (callback) callback(e);
    }

    async onClick(e, callback = false) {
        if (this.props.onClick) this.play(this.props.onClick);

        if (callback) callback(e);
    }

    async play(animationName, { callback, reverse = false, immediate = false, cascade = false, groupAdjust = 0, cascadeDelay = 0, staggerDelay = 0 } = {}) {
        if (this.props.parentLevel > 0 && !cascade) return;

        const animation = typeof animationName === 'string' ? this.animations[animationName] : this.animations.default;
        if (!animation) return;

        let __delay = 0;
        this.elements.forEach((el, i) => {
            let offset = 'group' in this.props ? this.props.parentLevel - this.props.group : this.level + groupAdjust;
            cascadeDelay = reverse ? animation.duration : cascadeDelay; // NOT FULLY CORRECT (also take into account reverse staggering)
            let delay = reverse ? offset * cascadeDelay : (this.props.parentLevel - offset) * cascadeDelay;
            delay = this.props.stagger * i + delay + staggerDelay;
            __delay = delay > __delay ? delay : __delay;

            animation.play(el, {
                delay,
                reverse,
                immediate
            });
        });

        for (const { animatable, staggerIndex } of this.children) {
            animatable.play(animationName, {
                reverse,
                immediate,
                cascade: true,
                staggerDelay: staggerIndex < 0 ? 0 : this.props.stagger * staggerIndex,
                cascadeDelay: animation.duration,
                groupAdjust: staggerIndex < 0 ? 0 : 1
            });
        }

        if (callback) AnimationQueue.delay(callback, __delay + animation.duration);
    }

    mergeProperties(own = {}, passed = {}) {
        const merged = { ...passed, ...own };

        for (const key in merged) {
            if (['children', 'parentLevel', 'ref'].includes(key)) {
                delete merged[key];
                continue;
            }
            if (Array.isArray(own[key]) || Array.isArray(passed[key])) continue;
            if (typeof own[key] === 'object' && typeof passed[key] === 'object') merged[key] = { ...passed[key], ...own[key] };
        }

        return merged;
    }

    deepClone(component, { index = 0, useElements = false, useEvents = true } = {}) {
        if (!isValidElement(component)) return component;

        let props = {};
        if (component.type !== Animatable && !(component.type.prototype instanceof Animatable)) {
            if (useElements) props = { ref: el => this.elements[index] = el };

            if (useEvents && (this.props.parentLevel < 1 || this.props.noCascade)) {
                props = {
                    ...props,
                    onMouseEnter: e => this.onEnter(e, component.props?.onMouseEnter),
                    onMouseLeave: e => this.onLeave(e, component.props?.onMouseLeave),
                    onFocus: e => this.onFocus(e, component.props?.onFocus),
                    onBlur: e => this.onBlur(e, component.props?.onBlur),
                    onClick: e => this.onClick(e, component.props?.onClick)
                };
                useEvents = false;
            }
        }

        if ((component.type === Animatable || component.type.prototype instanceof Animatable) && !component.props?.noCascade) {
            const idx = this.childrenIndex++;
            props = {
                ...props,
                ...this.mergeProperties(component.props, this.props),
                parentLevel: this.parentLevel > 0 ? this.parentLevel : this.level,
                ref: el => this.children[idx] = { animatable: el, staggerIndex: useElements ? index : -1 }
            };
        }

        const children = Children.map(component.props.children, (child, i) => this.deepClone(child, { index: i, useEvents }));

        return cloneElement(component, props, children);
    }

    countNestedLevels(children) {
        if (!children) return 0;

        let count = 0, nested = 0;
        Children.forEach(children, (child) => {
            if (!isValidElement(child)) return;
            if (child.type === Animatable || child.type.prototype instanceof Animatable) count = 1;

            const n = this.countNestedLevels(child.props?.children);
            nested = nested < n ? n : nested;
        });

        return nested + count;
    }

    render(children = this.props.children) {
        this.level = this.countNestedLevels(children);

        this.childrenIndex = 0;
        return Children.map(children, (child, i) => this.deepClone(child, { index: i, useElements: true }));
    }

    static defaultProps = {
        parentLevel: 0,
        stagger: 0.1,
        viewportMargin: 0.25,
        animate: {},
        animations: {}
    }

}