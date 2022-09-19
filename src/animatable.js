// TODO:
// allow for links to be used in objects such as link per scale component { x: link, y: link }

import { Children, cloneElement, Component, isValidElement } from 'react';
import Clip from './core/clip';
import AnimationManager from './core/manager';
import Animation from './animations/animation';
import { addEventListener, offAny, onAny, removeEventListener } from './core/utils/events';
import { inViewport, is, mergeObjects, throttle } from './core/utils/helper';

export default class Animatable extends Component {

    static isInstance(val) {
        return val.type === Animatable || val.type.prototype instanceof Animatable;
    }

    static events = ['click', 'mouseenter', 'mouseleave', 'focus', 'blur'];
    static cascadingProps = ['animate', 'initial', 'animations', 'stagger'];

    constructor(props) {
        super(props);

        this.animations = { default: this.parse(this.props.animate || {}) };
        for (const key in this.props.animations || {}) {
            this.animations[key] = this.parse(this.props.animations[key]);
        }

        this.children = [];
        this.elements = [];
        this.stagger = this.props.stagger || 0.1;
        this.manager = new AnimationManager({
            priority: this.props.group,
            stagger: this.stagger,
            culling: this.props.lazy,
            noDeform: this.props.noDeform,
            paused: this.props.paused
        });
    }

    parse(properties) {
        if (Animation.isInstance(properties)) return properties.use();

        return is.object(properties) ? new Clip(properties, this.props.initial) : null;
    }

    update() {
        this.manager.clear();
        this.manager.purge();
        this.manager.initialize(this.animations.default);
    }

    componentDidMount() {
        this.scrollEventListener = throttle(this.onScroll.bind(this));
        addEventListener('scroll', this.scrollEventListener);
        this.eventListener = this.onEvent.bind(this);
        onAny(Animatable.events, this.elements, this.eventListener);

        this.manager.set(this.elements); // maybe on component update update this aswell
        this.manager.register();
        this.update();

        document.fonts.ready.then(() => {
            this.update();
            clearTimeout(this.timeout); // improve (temp solution)
            this.inViewport = false;

            if (!this.props.group) {
                this.play(this.props.onMount);
                this.onScroll();
            }
        });
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.scrollEventListener);
        offAny(Animatable.events, this.elements, this.eventListener);

        this.manager.destroy();
    }

    componentDidUpdate() {
        this.manager.paused = this.props.paused;

        for (const child of this.children) child.manager.paused = this.props.paused;
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

        const { entered, left } = inViewport(this.getBoundingBox(), this.props.viewportMargin);

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

    play(animation, { reverse = false, composite = false, immediate = false, delay = 0, callback } = {}, delegate = false) {
        if (!animation || this.props.disabled || (this.props.group > 0 && !delegate)) return;
        if (!is.string(animation)) animation = 'default';

        this.dispatch('onAnimationStart');
        const clip = this.animations[animation];
        const duration = clip.length();

        // also implement stagger for direct animatable children (child.props.group)
        let parentDelay = 0;
        for (const child of this.children) {
            parentDelay = Math.max(parentDelay, child.play(animation, { reverse, immediate, delay: delay + duration }, true));
        }

        this.manager.play(clip, { reverse, composite, immediate, delay: reverse ? parentDelay : delay });

        if (immediate) clearTimeout(this.timeout); // improve (temp solution)
        if (!this.props.group) {
            this.timeout = setTimeout(() => {
                this.dispatch('onAnimationEnd');
                if (is.function(callback)) callback();
            }, (parentDelay + duration) * 1000);
        }

        return duration + (reverse ? parentDelay : delay);
    }

    stop() {
        this.manager.clear();
    }

    prerender(children, isDirectChild = true, isParent = true) {
        return Children.map(children, child => {
            if (!isValidElement(child)) return child;

            const props = { pathLength: 1 };
            if (isDirectChild) {
                const i = this.elementIndex++;
                props.ref = el => this.elements[i] = el;
            }

            if (Animatable.isInstance(child) && isParent && !child.props.noCascade) {
                const i = this.childIndex++;
                isParent = false;

                props.group = this.props.group + 1;
                props.ref = el => this.children[i] = el;
                if (!this.props.group) props.active = this.props.active; // TESTING

                mergeObjects(props, { ...this.props, ...child.props }, this.constructor.cascadingProps); // OPTIMIZE
            }

            return cloneElement(child, props, this.prerender(child.props.children, false, isParent));
        });
    }

    render() {
        this.elementIndex = this.childIndex = 0;

        return this.prerender(this.props.children);
    }

    static defaultProps = {
        group: 0,
        viewportMargin: 0.75,
        lazy: true,
        paused: false
    }

}