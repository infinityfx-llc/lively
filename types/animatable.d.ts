import React from 'react';
import { AnimationInitials, AnimationProperties } from './globals';

interface AnimatableProps {

    /**
     * How much to delay each subsequent `element` or `<Animatable>` component of the parent `<Animatable>` component, when animating it, in seconds.
     * 
     * @default 0.1
     */
    stagger?: number;

    /**
     * Percentage of `element` that needs to enter or leave the viewport (`window`) to trigger viewport based animations.
     * 
     * @default 0.75
     */
    viewportMargin?: number;

    /**
     * Define a default animation.
     */
    animate?: AnimationProperties;

    initial?: AnimationInitials;

    /**
     * Define animations as key-value pairs, where the key is the animation name.
     */
    animations?: {
        [key: string]: AnimationProperties;
    };

    /**
     * Whether to prevent cascading of an animation to child `<Animatable>` components.
     * 
     * @default false
     */
    noCascade?: boolean;

    /**
     * Play either the default or the defined animation when the component mounts.
     * 
     * @default false
     */
    onMount?: string | boolean;

    /**
     * Play either the default or the defined animation reversed when the component unmounts.
     * 
     * Note: this only works in combination with the `useUnmount`.
     * 
     * @default false
     */
    onUnmount?: string | boolean;

    /**
     * Play either the default or the defined animation when any child `element` is clicked.
     * 
     * @default false
     */
    onClick?: string | boolean;

    /**
     * Play either the default or the defined animation (reversed when leaving) when any child `element` enters or leaves the viewport.
     * 
     * @default false
     */
    whileViewport?: string | boolean;

    /**
     * Play either the default or the defined animation (reversed when leaving) when the mouse enters or leaves any child `element`.
     * 
     * @default false
     */
    whileHover?: string | boolean;

    /**
     * Play either the default or the defined animation (reversed when losing) when any child `element` gains or looses focus.
     * 
     * @default false
     */
    whileFocus?: string | boolean;

    group?: number;
}

export class Animatable extends React.Component<AnimatableProps> {

    private parse;

    private style;

    private update;

    private inViewport;

    private onScroll;

    private onResize;

    private onEnter;

    private onLeave;

    private onFocus;

    private onBlur;

    private onClick;

    play(animationName: string, { callback, reverse, immediate, cascade, groupAdjust, cascadeDelay, staggerDelay }?: {
        callback?: Function;
        reverse?: boolean;
        immediate?: boolean;
        cascade?: boolean;
        groupAdjust?: number;
        cascadeDelay?: number;
        staggerDelay?: number;
    }): Promise<void>;

    private mergeProperties;

    private deepClone;
    
    private countNestedLevels;

}