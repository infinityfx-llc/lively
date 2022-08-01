import React, { Children, cloneElement, isValidElement } from 'react';
import Animatable from './animatable';
import Animation from './core/animation';
import AnimationQueue from './core/queue';
import { cacheElementStyles, isObject, livelyProperty } from './core/utils/helper';

// fontsize animation is broken
// add padding morph
// delay layout updating when mid animation

export default class Morph extends Animatable {

    constructor(props) {
        super(props);

        this.properties = this.props.properties || ['position', 'scale', 'opacity', 'backgroundColor', 'color', 'interact', 'zIndex'];
        if (!this.props.properties && this.props.useLayout) this.properties.push('borderRadius', 'fontSize');

        this.parent = this.props.parent?.() || { group: '' };
        this.group = this.parent.group + this.props.group;

        this.useLayout = false;
        this.childStyles = { pointerEvents: 'initial' };
        this.parentStyles = {
            background: 'transparent',
            border: 'none',
            padding: 0,
            pointerEvents: 'none',
            backdropFilter: 'none',
            boxShadow: 'unset',
            fontSize: 'unset',
            zIndex: 'unset'
        };
    }

    layout() {
        this.position = this.position || getComputedStyle(this.element).position;
        let parentStyles = {
            ...this.parentStyles,
            width: this.element.offsetWidth, // recalc
            height: this.element.offsetHeight
        };

        if (this.position === 'absolute' || this.position === 'fixed') { // Maybe use contain css prop
            parentStyles.position = 'absolute';
        } else {
            parentStyles.position = 'relative';
            this.childStyles = { ...this.childStyles, position: 'absolute', margin: 0, top: 0, left: 0 };
        }

        this.parentStyles = parentStyles;
        this.useLayout = true;
        this.hasUpdated = true;

        this.forceUpdate();
    }

    async update({ mount = !this.useLayout, active = this.props.active } = {}) {
        this.element = this.elements[0];
        if (!this.element) return;

        if (this.props.useLayout && mount) return this.layout();

        if (this.element.Lively && !this.hasUpdated) return;
        cacheElementStyles(this.element); // Doesn't quite work 100% yet
        this.hasUpdated = false;

        if (this.parent.props) return;
        await AnimationQueue.sleep(0.001);

        this.setUniqueId();
        this.animations = { default: this.unmorphAnimation() };
        if (!active) this.animations.default.initial(this.element);

        for (const { animatable } of this.children) { // DOESNT WORK FOR MULTI NESTED CHILDREN
            animatable.setUniqueId();
            animatable.animations = { default: animatable.unmorphAnimation() };
            if (!active) animatable.animations.default.initial(animatable.element);
        }
    }

    setUniqueId() {
        if (this.parent.id) this.id = this.parent.id;
        if (!('id' in this)) {
            livelyProperty('Morph', {});
            if (!(this.group in window.Lively.Morph)) window.Lively.Morph[this.group] = 0;
            this.id = window.Lively.Morph[this.group]++;
        }

        if ('id' in this) this.element.setAttribute('lively-morph-id', this.id.toString());
    }

    async componentDidUpdate(prevProps) {
        // const updated = Object.keys(prevProps).reduce((arr, key) => prevProps[key] != this.props[key] ? [...arr, key] : arr, []); // check to see when mount needs to be true

        await this.update({ mount: false, active: prevProps.active });

        if (prevProps.active !== this.props.active) this.morph(this.props.active);
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

        this.animations[id] = this.morphAnimation(this.element, target);

        for (const { animatable } of this.children) {
            animatable.createAnimations(id);
        }
    }

    animationFromKeyframes(keyframes, reference = {}) {
        const keys = { useLayout: this.props.useLayout, interpolate: this.props.interpolate, origin: { x: 0, y: 0 }, duration: this.props.duration };

        for (const prop of this.properties) {
            if (this.props.ignore.includes(prop)) continue;

            const arrKey = prop in keyframes ? prop : 'auto';
            if (!(arrKey in keyframes)) continue;

            keys[prop] = keyframes[arrKey].map(entry => {
                if (!isObject(entry)) {
                    return entry in reference ? reference[entry][prop] : entry;
                }

                const keys = {};
                for (const key in entry) {
                    if (entry[key] in reference) {
                        keys[key] = reference[entry[key]][prop];
                    } else {
                        keys[key] = entry[key];
                    }
                }
                return keys;
            });
        }

        return new Animation(keys);
    }

    morphAnimation(from, to) {
        if (!to) return this.animationFromKeyframes({ opacity: [1, 0, 0], interact: [true, false, false] });

        from = from.Lively?.initials;
        to = to.Lively?.initials;

        this.x = to.x - from.x;
        this.y = to.y - from.y;
        if (this.parent.props) {
            this.x -= this.parent.x;
            this.y -= this.parent.y;
        }

        return this.animationFromKeyframes(
            {
                auto: ['from', 'to', { set: 'to', end: 'from' }],
                position: ['from', 'to', { set: 'to', end: 'from' }],
                scale: ['from', 'to', { set: 'to', end: 'from' }],
                opacity: [1, 1, { end: 0 }], 
                interact: [true, true, { end: false }]
            },
            {
                from: {
                    ...from,
                    position: { x: 0, y: 0 },
                    scale: { x: 1, y: 1 }
                },
                to: {
                    ...to,
                    position: { x: this.x, y: this.y },
                    scale: { x: parseInt(to.width) / parseInt(from.width), y: parseInt(to.height) / parseInt(from.height) } // also base scale off of parent when no uselayout (do in Animatable)
                }
            }
        );
    }

    unmorphAnimation() {
        const from = this.element.Lively.initials;
        return this.animationFromKeyframes(
            { auto: ['from', 'from', 'from'], position: [{ x: 0, y: 0 }], scale: [{ x: 1, y: 1 }], opacity: [0, 0, 1], interact: [false, false, true], zIndex: ['from', from.zIndex + 1, { set: from.zIndex + 1, end: 'from' }] }, // FIXXXX!!!
            { from }
        );
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
            style: { ...element.props.style, ...this.childStyles }
        };
        const animatable = super.render(cloneElement(element, props, children));

        return this.useLayout ? cloneElement(element, { style: this.parentStyles }, animatable) : animatable;
    }

    static defaultProps = {
        group: 0,
        active: false,
        useLayout: false,
        interpolate: 'ease',
        duration: 1.5,
        ignore: []
    }

}