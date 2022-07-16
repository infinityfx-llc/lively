import React, { Children, cloneElement, isValidElement } from 'react';
import Animatable from './animatable';
import Animation from './animation';
import AnimationQueue from './queue';
import { cacheElementStyles, setStyles } from './utils';

export default class Morph extends Animatable {

    static properties = ['position', 'scale', 'opacity', 'backgroundColor', 'color', 'interact']
    static layoutProperties = ['borderRadius', 'fontSize']

    constructor(props) {
        super(props);

        this.parent = this.props.parent?.() || { group: '' };
        this.group = this.parent.group + this.props.group;
        this.state = {
            useLayout: false,
            childStyles: {},
            parentStyles: {
                position: 'relative',
                background: 'transparent',
                border: 'none',
                pointerEvents: 'none',
                backdropFilter: 'none',
                fontSize: 'unset'
            }
        };
    }

    layoutUpdate() {
        delete this.element.Lively;
        const { position } = getComputedStyle(this.element);
        let childStyles, useLayout = this.state.useLayout;

        if ((position === 'absolute' || position === 'fixed') && !useLayout) {
            childStyles = { top: this.element.offsetTop, left: this.element.offsetLeft };
        } else {
            childStyles = { position: 'absolute', margin: 0, top: 0, left: 0, pointerEvents: 'initial' };
            useLayout = true;
        }

        this.setState({
            childStyles,
            parentStyles: {
                ...this.state.parentStyles,
                width: this.element.offsetWidth,
                height: this.element.offsetHeight
            },
            useLayout
        });
    }

    async update(layout = false, active = this.props.active) {
        const previous = this.element?.Lively;
        this.element = this.elements[0];
        if (!this.element) return;

        if (layout && this.props.useLayout) return this.layoutUpdate();

        if (previous && !layout) { // DOESN'T WORK TOGETHER WITH RESIZE AND ON DEMAND MORPH GENERATION
            this.element.Lively = previous;
            setStyles(this.element, previous.style);
        } else {
            cacheElementStyles(this.element);
        }

        if (this.parent.props) return;
        await AnimationQueue.sleep(0.001);

        this.setUniqueId();
        this.animations = { default: this.createUnmorphAnimation() };
        this.animations.default.setToLast(this.element, !active);

        this.children.forEach(({ animatable }) => {
            animatable.setUniqueId();
            animatable.animations = { default: animatable.createUnmorphAnimation() };
            animatable.animations.default.setToLast(animatable.element, !active);
        });
    }

    setUniqueId() {
        if (this.parent.id) this.id = this.parent.id;
        if (!('id' in this)) {
            if (!('Lively' in window)) window.Lively = {};
            if (!('Morph' in window.Lively)) window.Lively.Morph = {};
            if (!(this.group in window.Lively.Morph)) window.Lively.Morph[this.group] = 0;
            this.id = window.Lively.Morph[this.group]++;
        }

        if ('id' in this) this.element.setAttribute('lively-morph-id', this.id.toString());
    }

    async componentDidUpdate(prevProps) {
        await this.update(false, prevProps.active);

        if (prevProps.active !== this.props.active) {
            this.morph(this.props.active);
        }
    }

    async morph(active) {
        if (active) this.element.setAttribute('lively-morph-target', true);

        await AnimationQueue.sleep(0.001);

        if (active) {
            this.play('default', { immediate: true });
        } else {
            const target = document.querySelector(`[lively-morph-group="${this.group}"][lively-morph-target="true"]`);
            if (target) {
                target.removeAttribute('lively-morph-target');
                const id = target.getAttribute('lively-morph-id');
                if (!(id in this.animations)) this.createAnimations(id);

                this.play(id, { immediate: true });
            }
        }
    }

    createAnimations(id) {
        const target = document.querySelector(`[lively-morph-group="${this.group}"][lively-morph-id="${id}"]`);

        this.animations[id] = this.createMorphAnimation(target);

        this.children.forEach(({ animatable }) => animatable.createAnimations(id));
    }

    createAnimation(target, keyframe = {}) {
        const from = this.element.Lively?.initials;
        const to = target?.Lively?.initials;

        const props = Morph.properties;
        if (this.props.useLayout) props.push(...Morph.layoutProperties);
        const keys = { useLayout: this.props.useLayout, interpolate: this.props.interpolate, origin: { x: 0, y: 0 }, duration: this.props.duration };

        for (const key of props) {
            if (this.props.ignore.includes(key)) continue;

            if (key in keyframe) {
                keys[key] = keyframe[key];
            } else {
                keys[key] = to ? [from[key], to[key], to[key]] : [from[key], from[key], from[key]];
            }
        }

        return new Animation(keys);
    }

    createMorphAnimation(target) {
        if (!target) return this.createAnimation(null, { opacity: [1, 0, 0], interact: [true, false, false] });

        const a = this.element.Lively?.initials;
        const b = target.Lively?.initials;

        this.x = b.x - a.x;
        this.y = b.y - a.y;
        if (this.parent.props) {
            this.x -= this.parent.x;
            this.y -= this.parent.y;
        }

        const x = parseInt(b.width) / parseInt(a.width);
        const y = parseInt(b.height) / parseInt(a.height);

        return this.createAnimation(target, {
            position: [{ x: 0, y: 0 }, { x: this.x, y: this.y }, { x: this.x, y: this.y }],
            scale: [{ x: 1, y: 1 }, { x, y }, { x, y }],
            opacity: [1, 1, 0],
            interact: [true, true, false]
        });
    }

    createUnmorphAnimation() {
        return this.createAnimation(null, {
            position: { x: 0, y: 0 },
            scale: { x: 1, y: 1 },
            opacity: [0, 0, 1],
            interact: [false, false, true]
        });
    }

    getChildren(children) {
        return Children.map(children, child => {
            if (!isValidElement(child)) return child;

            const props = child.type !== Morph ? {} : { parent: () => this, duration: this.props.duration };

            return cloneElement(child, props, this.getChildren(child.props.children));
        });
    }

    render() {
        const element = this.props.children?.length ? this.props.children[0] : this.props.children;
        if (!isValidElement(element)) return element;

        const children = this.getChildren(element.props.children);
        const props = {
            "lively-morph-group": this.group,
            style: { ...element.props.style, ...this.state.childStyles }
        };
        const animatable = super.render(cloneElement(element, props, children));

        return this.state.useLayout ? cloneElement(element, { style: this.state.parentStyles }, animatable) : animatable;
    }

    static defaultProps = {
        id: null,
        group: 0,
        active: false,
        useLayout: false,
        interpolate: 'ease',
        duration: 1.5,
        ignore: []
    }

}