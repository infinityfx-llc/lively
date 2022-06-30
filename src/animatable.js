import { Children, cloneElement, Component, isValidElement } from 'react';
import Animation from './animation';

// on window resize reset initial elements sizes
// implement keyframe position (not all evenly spaced)
// mabye split whileViewport up into onEnter and onLeave
// animate things like background color
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
        this.animations = {
            animate: this.getAnimation(),
            onMount: this.getAnimation('onMount'),
            onUnmount: this.getAnimation('onUnmount'),
            onClick: this.getAnimation('onClick'),
            whileHover: this.getAnimation('whileHover'),
            whileFocus: this.getAnimation('whileFocus'),
            whileViewport: this.getAnimation('whileViewport')
        };

        this.level = 0;
        this.children = [];
    }

    getAnimation(name = 'animate') {
        if (name === 'animate' && this.props.animation && (typeof this.props.animation === 'object' || typeof this.props.animation === 'function') && 'use' in this.props.animation) {
            return this.props.animation.use();
        }

        return Animation.from(this.props[name], this.props.initial, this.props.scaleCorrection);
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

    addEvent(event, callback) {
        if (!(callback instanceof Function)) return;

        if (!window.UITools?.Events) window.UITools = { Events: {} };
        if (!(event in window.UITools.Events)) {
            window.UITools.Events[event] = { unique: 0 };
            window.addEventListener(event, e => {
                Object.values(window.UITools.Events[event]).forEach(cb => {
                    if (cb instanceof Function) cb(e);
                })
            });
        }

        callback.UITools = { ListenerID: window.UITools.Events[event].unique };
        window.UITools.Events[event][window.UITools.Events[event].unique] = callback;
        window.UITools.Events[event].unique++;
    }

    removeEvent(event, callback) {
        if (typeof window === 'undefined' || !window.UITools?.Events || !(event in window.UITools?.Events)) return;
        if (!('ListenerID' in callback.UITools)) return;

        delete window.UITools.Events[event][callback.UITools.ListenerID];
    }

    componentDidMount() {
        this.elements.forEach(el => {
            this.animations.animate?.setInitialStyles(el);
        });


        if (this.props.parentLevel < 1 || this.props.noCascade) {
            this.scrollEventListener = this.onScroll.bind(this);
            this.addEvent('scroll', this.scrollEventListener);

            if (this.props.onMount) this.play('onMount', { staggerDelay: 0.001 });
            if (this.props.whileViewport) this.onScroll();
        }
    }

    componentWillUnmount() {
        this.removeEvent('scroll', this.scrollEventListener);

        if (this.props.onUnmount && (this.props.parentLevel < 1 || this.props.noCascade)) this.play('onUnmount', { reverse: true, immediate: true });
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
            if (this.props.whileViewport) this.play('whileViewport');
        }

        if (this.inView && left) {
            this.inView = false;
            if (this.props.whileViewport) this.play('whileViewport', { reverse: true, immediate: true });
        }
    }

    async onEnter(e, callback = false) {
        if (!this.hover) {
            if (this.props.whileHover) this.play('whileHover');
            this.hover = true;
        }

        if (callback) callback(e);
    }

    async onLeave(e, callback = false) {
        if (this.hover) {
            if (this.props.whileHover) this.play('whileHover', { reverse: true });
            this.hover = false;
        }

        if (callback) callback(e);
    }

    async onFocus(e, callback = false) {
        if (!this.hasFocus) {
            if (this.props.whileFocus) this.play('whileFocus');
            this.hasFocus = true;
        }

        if (callback) callback(e);
    }

    async onBlur(e, callback = false) {
        if (this.hasFocus) {
            if (this.props.whileFocus) this.play('whileFocus', { reverse: true });
            this.hasFocus = false;
        }

        if (callback) callback(e);
    }

    async onClick(e, callback = false) {
        if (this.props.onClick) this.play('onClick');

        if (callback) callback(e);
    }

    async play(animationName, { reverse = false, immediate = false, cascade = false, groupAdjust = 0, cascadeDelay = 0, staggerDelay = 0 } = {}) {
        if (this.props.parentLevel > 0 && !cascade) return;

        let animation = this.animations[animationName];
        if (!animation) animation = this.animations.animate;
        if (!animation) return;

        this.elements.forEach((el, i) => {
            let offset = 'group' in this.props ? this.props.parentLevel - this.props.group : this.level + groupAdjust;
            cascadeDelay = reverse ? animation.duration : cascadeDelay; // NOT FULLY CORRECT (also take into account reverse staggering)
            const delay = reverse ? offset * cascadeDelay : (this.props.parentLevel - offset) * cascadeDelay;

            animation.play(el, {
                delay: this.props.stagger * i + delay + staggerDelay,
                reverse,
                immediate
            });
        });

        this.children.forEach(({ animatable, staggerIndex = -1 }) => {
            animatable.play(animationName, {
                reverse,
                immediate,
                cascade: true,
                staggerDelay: staggerIndex < 0 ? 0 : this.props.stagger * staggerIndex,
                cascadeDelay: animation.duration,
                groupAdjust: staggerIndex < 0 ? 0 : 1
            });
        });
    }

    style(inherited = {}) {
        const styles = {
            ...inherited,
            transitionProperty: `transform, opacity, clip-path, border-radius, backgroundColor, color${this.props.scaleCorrection ? ', width, height, left, top' : ''}`,
            willChange: 'transform'
        };

        return styles;
    }

    mergeProperties(own = {}, passed = {}) {
        const merged = {};
        merged.initial = this.mergeProperty(passed.initial, own.initial);
        merged.animate = this.mergeProperty(passed.animate, own.animate);

        merged.onMount = this.mergeProperty(passed.onMount, own.onMount);
        merged.onUnmount = this.mergeProperty(passed.onUnmount, own.onUnmount);
        merged.onClick = this.mergeProperty(passed.onClick, own.onClick);
        merged.whileHover = this.mergeProperty(passed.whileHover, own.whileHover);
        merged.whileFocus = this.mergeProperty(passed.whileFocus, own.whileFocus);
        merged.whileViewport = this.mergeProperty(passed.whileViewport, own.whileViewport);

        merged.viewportMargin = this.mergeProperty(passed.viewportMargin, own.viewportMargin);
        merged.stagger = this.mergeProperty(passed.stagger, own.stagger);

        return merged;
    }

    mergeProperty(a, b) {
        if (!a) return b;
        if (!b) return a;

        if (typeof a === 'object' || typeof b === 'object') return { ...a, ...b };

        return b;
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
                ref: el => this.children[this.children.length] = { animatable: el, staggerIndex: useElements ? index : -1 }
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
        animate: {}
    }

}