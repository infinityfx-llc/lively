import React, { Children, cloneElement, Component, isValidElement } from 'react';
import Animatable from './animatable';
import { Move, Pop } from './animations';
import { padArray } from './utils';

export default class Animate extends Component {

    constructor(props) {
        super(props);

        this.levels = this.props.levels;
        this.animations = padArray(this.props.animations, this.levels);
    }

    makeAnimatable(children, level = 1) {
        if (level < 1 || Children.count(children) < 1) return children;

        const { levels, animations, ...props } = this.props;
        const animation = this.animations[this.levels - level];

        if (level === this.levels) props.ref = el => this.animatable = el;
        return <Animatable animate={animation} {...props}>
            {Children.map(children, child => {
                if (!isValidElement(child)) return child;

                return cloneElement(child, {}, this.makeAnimatable(child.props.children, level - 1));
            })}
        </Animatable>;
    }

    play(animationName, options = {}) {
        this.animatable?.play(animationName, { ...options });
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.animations !== this.props.animations) return false; // incorrect doesn't work for Animatable component (maybe use pure-component) (root cause is unnecessary update in unmount hook)

        return true;
    }

    render() {
        return this.makeAnimatable(this.props.children, this.levels);
    }

    static defaultProps = {
        levels: 1,
        stagger: 0.1,
        viewportMargin: 0.25,
        animations: [Move, Pop]
    }

}