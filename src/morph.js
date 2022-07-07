import { Children, cloneElement, isValidElement } from 'react';
import Animatable from './animatable';
import Animation from './animation';
import AnimationQueue from './queue';
import { cacheElementStyles } from './utils';

export default class Morph extends Animatable {

    static properties = ['position', 'scale', 'opacity', 'backgroundColor', 'color', 'borderRadius', 'interact']

    constructor(props) {
        super(props);

        this.group = this.props.parentGroup + this.props.group;
        this.state = {
            useContainer: false,
            childStyles: {},
            parentStyles: {
                position: 'relative',
                background: 'transparent',
                border: 'none',
                pointerEvents: 'none',
                backdropFilter: 'none'
            }
        };
    }

    setUniqueId() {
        if (this.props.parentGroup.length) return;

        if (!('Lively' in window)) window.Lively = {};
        if (!('Morph' in window.Lively)) window.Lively.Morph = {};
        if (!(this.group in window.Lively.Morph)) window.Lively.Morph[this.group] = 0;
        this.id = window.Lively.Morph[this.group]++;
        this.element.setAttribute('lively-morph-id', this.id);

        for (const { animatable } of this.children) {
            if (animatable) animatable.id = this.id;
            animatable?.element.setAttribute('lively-morph-id', this.id);
        }
    }

    reset() {
        this.element = this.elements[0];
        this.setUniqueId();

        cacheElementStyles(this.element);
        this.animations = {};
        this.animations.default = this.createResetAnimation();
        if (!this.props.active && !this.props.parentGroup.length) this.setInitial();
    }

    async componentDidMount() {
        this.element = this.elements[0];
        if (!this.element) return;

        if (this.props.useLayout) {
            const { position } = getComputedStyle(this.element);
            if (position === 'absolute' || position === 'fixed') {
                this.setState({ childStyles: { top: this.element.offsetTop, left: this.element.offsetLeft } });
            } else {
                this.setState({
                    childStyles: { position: 'absolute', margin: 0, top: 0, left: 0, pointerEvents: 'initial' },
                    parentStyles: {
                        width: this.element.offsetWidth,
                        height: this.element.offsetHeight,
                        ...this.state.parentStyles
                    },
                    useContainer: true
                });
            }
        }

        this.reset();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.useContainer !== this.state.useContainer) {
            this.reset();
        }

        if (prevProps.active === this.props.active) return;
        if (this.props.active) this.element.setAttribute('lively-morph-target', true);

        await AnimationQueue.sleep(0.001);

        if (this.props.active) {
            this.play('default');
        } else {
            const target = document.querySelector(`[lively-morph-group="${this.group}"][lively-morph-target="true"]`);
            if (target) {
                target.removeAttribute('lively-morph-target');
                const id = target.getAttribute('lively-morph-id');
                if (!(id in this.animations)) this.createAnimation(id);

                this.play(id);
            }
        }
    }

    createAnimation(id) {
        const target = document.querySelector(`[lively-morph-group="${this.group}"][lively-morph-id="${id}"]`);
        if (!target) return;

        this.animations[id] = this.createMorphAnimation(target);

        this.children.forEach(({ animatable }) => animatable?.createAnimation(id));
    }

    getParentPosition(element) {
        const parent = this.props.useLayout && this.state.useContainer ? element.parentElement?.parentElement : element.parentElement;
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

        if (!this.props.useLayout) {
            x += (b.width - a.width) / 2;
            y += (b.height - a.height) / 2;
        }

        return [{ x: 0, y: 0 }, { x, y }, { x, y }];
    }

    scaleKeyframes(a, b) {
        const x = parseInt(b.width) / parseInt(a.width);
        const y = parseInt(b.height) / parseInt(a.height);

        return [{ x: 1, y: 1 }, { x, y }, { x, y }];
    }

    createMorphAnimation(target) {
        const a = this.element.Lively?.initials;
        const b = target.Lively?.initials;
        const keys = { useLayout: this.props.useLayout, interpolate: this.props.interpolate };

        for (const key of Morph.properties) {
            if (this.props.ignore.includes(key)) continue;

            switch (key) {
                case 'position': keys[key] = this.positionKeyframes(target);
                    break;
                case 'scale': keys[key] = this.scaleKeyframes(a, b);
                    break;
                case 'opacity': keys[key] = [1, 1, 0];
                    break;
                case 'interact': keys[key] = [true, true, false];
                    break;
                default: keys[key] = [a[key], b[key], b[key]];
            }
        }

        return new Animation(keys);
    }

    createResetAnimation() {
        const a = this.element.Lively?.initials;
        const keys = { useLayout: this.props.useLayout, interpolate: this.props.interpolate };

        for (const key of Morph.properties) {
            if (this.props.ignore.includes(key)) continue;

            switch (key) {
                case 'position': keys[key] = { x: 0, y: 0 };
                    break;
                case 'scale': keys[key] = { x: 1, y: 1 };
                    break;
                case 'opacity': keys[key] = [0, 0, 1];
                    break;
                case 'interact': keys[key] = [false, false, true];
                    break;
                default: keys[key] = [a[key], a[key], a[key]];
            }
        }

        return new Animation(keys);
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
        const props = { "lively-morph-group": this.group, style: this.state.childStyles };
        const animatable = super.render(cloneElement(element, props, children));

        return this.state.useContainer ? cloneElement(element, { style: this.state.parentStyles }, animatable) : animatable;
    }

    static defaultProps = {
        id: null,
        group: 0,
        parentGroup: '',
        active: false,
        useLayout: false,
        interpolate: 'ease',
        ignore: []
    }

}