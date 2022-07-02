import React, { Children, cloneElement, Component, isValidElement } from 'react';
import Animation from './animation';
import AnimationQueue from './queue';
import { addEventListener, removeEventListener } from './utils';

// on window resize reset initial elements sizes
// implement keyframe position (not all evenly spaced)
// mabye split whileViewport up into onEnter and onLeave
// implement repeat argument (and maybe repeat delay)
// cancel animationqueue delays

export default class Animatable extends Component {

    constructor(props) {
        super(props);

        this.hover = false;
        this.hasFocus = false;
        this.inView = false;
        this.scrollDelta = 0;
        this.viewportMargin = props.viewportMargin;

        this.elements = [];
        this.animations = { default: this.toAnimation(this.props.animate) };
        for (const key in this.props.animations) {
            this.animations[key] = this.toAnimation(this.props.animations[key]);
        }

        this.level = 0;
        this.children = [];
    }

    toAnimation(animation) {
        if (!animation || (typeof animation !== 'object' && typeof animation !== 'function')) return null;
        if ('use' in animation) return animation.use();

        return new Animation({ ...animation, scaleCorrection: this.props.scaleCorrection }, this.props.initial);
    }

    countNestedLevels(children) {
        if (!children) return 0;

        let count = 0, nested = 0;
        Children.forEach(children, (child) => {
            if (!isValidElement(child)) return;
            if (child.type === Animatable) count = 1;

            const n = this.countNestedLevels(child.props?.children);
            nested = nested < n ? n : nested;
        });

        return nested + count;
    }

    componentDidMount() {
        this.elements.forEach(el => {
            this.animations.default?.setInitialStyles(el);
        });

        if (this.props.parentLevel < 1 || this.props.noCascade) {
            this.scrollEventListener = this.onScroll.bind(this);
            addEventListener('scroll', this.scrollEventListener);

            if (this.props.onMount) this.play(this.props.onMount, { staggerDelay: 0.001, immediate: true });
            if (this.props.whileViewport) this.onScroll();
        }
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.scrollEventListener);

        if (this.props.onUnmount && (this.props.parentLevel < 1 || this.props.noCascade)) this.play(this.props.onUnmount, { reverse: true, immediate: true });
    }

    inViewport() {
        let entered = true, left = true;

        this.elements.forEach(el => {
            const { y } = el.getBoundingClientRect();
            entered = entered && y + el.clientHeight * (1 - this.viewportMargin) < window.innerHeight;
            left = left && y > window.innerHeight + el.clientHeight * this.viewportMargin;
        });

        if (!this.elements.length) {
            this.children.forEach(({ animatable }) => {
                const [nestedEntered, nestedLeft] = animatable.inViewport();
                entered = entered && nestedEntered;
                left = left && nestedLeft;
            });
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

        this.children.forEach(({ animatable, staggerIndex = -1 }) => {
            animatable?.play(animationName, {
                reverse,
                immediate,
                cascade: true,
                staggerDelay: staggerIndex < 0 ? 0 : this.props.stagger * staggerIndex,
                cascadeDelay: animation.duration,
                groupAdjust: staggerIndex < 0 ? 0 : 1
            });
        });
        
        if (callback) AnimationQueue.delay(callback, __delay + animation.duration);
    }

    style(inherited = {}) {
        const styles = {
            ...inherited,
            transitionProperty: `transform, opacity, clip-path, border-radius, background-color, color, width, height, left, top`,
            willChange: 'transform'
        };

        return styles;
    }

    mergeProperties(own = {}, passed = {}) {
        const merged = { ...passed, ...own };

        for (const key in merged) {
            if (['children', 'parentLevel', 'ref'].includes(key)) {
                delete merged[key];
                continue;
            }
            if (typeof own[key] === 'object' && typeof passed[key] === 'object') merged[key] = { ...passed[key], ...own[key] };
        }

        return merged;
    }

    deepClone(component, { index = 0, useElements = false, useEvents = false } = {}) {
        if (!isValidElement(component)) return component;

        let props = {};
        if (component.type !== Animatable) {
            if (useElements) props = { style: this.style(component.props?.style), ref: el => this.elements[index] = el };

            if (useEvents && (this.props.parentLevel < 1 || this.props.noCascade)) {
                props = {
                    ...props,
                    onMouseEnter: e => this.onEnter(e, component.props?.onMouseEnter),
                    onMouseLeave: e => this.onLeave(e, component.props?.onMouseLeave),
                    onFocus: e => this.onFocus(e, component.props?.onFocus),
                    onBlur: e => this.onBlur(e, component.props?.onBlur),
                    onClick: e => this.onClick(e, component.props?.onClick),
                };
                useEvents = false;
            }
        }

        if (component.type === Animatable && !component.props?.noCascade) {
            props = {
                ...props,
                ...this.mergeProperties(component.props, this.props),
                parentLevel: this.parentLevel > 0 ? this.parentLevel : this.level,
                ref: el => this.children[this.children.length] = { animatable: el, staggerIndex: useElements ? index : -1 } // on rerender this breaks (adds null to array)
            };
        }

        const children = Children.map(component.props.children, (child, i) => this.deepClone(child, { index: i, useEvents }));

        return Object.values(props).length ? cloneElement(component, props, children) : component; // CHECK IF CORRECT
    }

    render() {
        this.level = this.countNestedLevels(this.props.children);

        return Children.map(this.props.children, (child, i) => this.deepClone(child, { index: i, useElements: true, useEvents: true }));
    }

    static defaultProps = {
        scaleCorrection: false,
        parentLevel: 0,
        stagger: 0.1,
        viewportMargin: 0.25,
        animate: {},
        animations: {}
    }

}