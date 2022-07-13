import React, { Children, cloneElement, isValidElement } from 'react';
import Animatable from './animatable';
import Animation from './animation';
import AnimationQueue from './queue';
import { cacheElementStyles } from './utils';

export default class Morph extends Animatable {

    static properties = ['position', 'scale', 'opacity', 'backgroundColor', 'color', 'interact']
    static layoutProperties = ['borderRadius', 'fontSize']

    constructor(props) {
        super(props);

        this.layoutOffset = false;
        this.group = this.props.parentGroup + this.props.group;
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
        const { position } = getComputedStyle(this.element);
        let childStyles, useLayout = false;

        if (position === 'absolute' || position === 'fixed') {
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

    update(layout = false) {
        this.element = this.elements[0];
        if (!this.element) return;

        if (layout && this.props.useLayout) return this.layoutUpdate();

        this.layoutOffset = this.props.useLayout && this.state.useLayout;

        if (this.props.parentGroup.length) return;

        this.setUniqueId();
        cacheElementStyles(this.element);
        this.animations = { default: this.createUnmorphAnimation() };
        if (!this.props.active) this.animations.default.setInitial(this.element);

        for (const { animatable } of this.children) {
            if (!animatable) continue;

            animatable.setUniqueId(this.id);
            cacheElementStyles(animatable.element);
            animatable.animations = { default: animatable.createUnmorphAnimation() };

            if (!this.props.active) animatable.animations.default.setInitial(animatable.element);
        }
    }

    setUniqueId(id = null) {
        if (id !== null) this.id = id;
        if (!('id' in this)) {
            if (!('Lively' in window)) window.Lively = {};
            if (!('Morph' in window.Lively)) window.Lively.Morph = {};
            if (!(this.group in window.Lively.Morph)) window.Lively.Morph[this.group] = 0;
            this.id = window.Lively.Morph[this.group]++;
        }

        if ('id' in this) this.element.setAttribute('lively-morph-id', this.id.toString());
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.active !== this.props.active) {
            this.morph(nextProps.active);
            return false;
        }

        return true;
    }

    async componentDidUpdate() {
        this.update();
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

        this.children.forEach(({ animatable }) => animatable?.createAnimations(id));
    }

    getParentPosition(element) {
        let parent = this.layoutOffset ? element.parentElement?.parentElement : element.parentElement;
        if (parent.getAttribute('lively-morph-layout') === 'true') parent = parent?.parentElement;
        return parent?.getBoundingClientRect() || { x: 0, y: 0 };
    }

    positionKeyframes(target) {
        const a = this.element.Lively?.initials;
        const b = target.Lively?.initials;

        let x = b.x - a.x, y = b.y - a.y;
        if (this.props.parentGroup.length) {
            let parentA = this.getParentPosition(this.element);
            let parentB = this.getParentPosition(target);

            x -= parentB.x - parentA.x;
            y -= parentB.y - parentA.y;
        }

        return [{ x: 0, y: 0 }, { x, y }, { x, y }];
    }

    scaleKeyframes(a, b) {
        const x = parseInt(b.width) / parseInt(a.width);
        const y = parseInt(b.height) / parseInt(a.height);

        return [{ x: 1, y: 1 }, { x, y }, { x, y }];
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

        return this.createAnimation(target, {
            position: this.positionKeyframes(target),
            scale: this.scaleKeyframes(a, b),
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

            const props = child.type !== Morph ? {} : { parentGroup: this.props.parentGroup + this.props.group };

            return cloneElement(child, props, this.getChildren(child.props.children));
        });
    }

    render() {
        const element = this.props.children?.length ? this.props.children[0] : this.props.children;
        if (!isValidElement(element)) return element;

        const children = this.getChildren(element.props.children);
        const props = {
            "lively-morph-group": this.group,
            "lively-morph-layout": this.layoutOffset.toString(),
            style: { ...element.props.style, ...this.state.childStyles }
        };
        const animatable = super.render(cloneElement(element, props, children));

        return this.state.useLayout ? cloneElement(element, { style: this.state.parentStyles }, animatable) : animatable;
    }

    static defaultProps = {
        id: null,
        group: 0,
        parentGroup: '',
        active: false,
        useLayout: false,
        interpolate: 'ease',
        duration: 1.5,
        ignore: []
    }

}