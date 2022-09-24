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
     * What percentage of previous animation duration to wait for in a cascading animation.
     * 
     * @default 1
     */
    cascade?: number;

    /**
     * Percentage of `element` that needs to enter or leave the viewport (`window`) to trigger viewport based animations.
     * 
     * @default 0.75
     */
    viewportMargin?: number;

    /**
     * Controls the order in which the component animates when part of a cascading animation.
     */
    group?: number;

    /**
     * Whether to pause an animation when the animated `element` is not visible on screen.
     * 
     * @default true
     */
    lazy?: boolean;

    /**
     * Whether all playing animations should be paused or not.
     * 
     * @default false
     */
    paused?: boolean;

    /**
     * Whether to correct an `element`'s children and certain of it's properties for deformations caused by scaling the `element`. 
     * 
     * @default false
     */
    noDeform?: boolean;

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
    stopPropagation?: boolean;

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
}

export class Animatable extends React.Component<AnimatableProps> {

    /**
     * Checks whether something is an instance of `Animatable` or a class that extends it.
     */
    static isInstance(val: any): boolean;

    private parse;

    private update;

    private dispatch;

    private onEvent;

    private onScroll;

    private getBoundingBox;

    /**
     * Play an animation referenced in `this.animations`.
     * 
     * @param {string} animation
     * @param {object} [options]
     * @param {Function} [options.callback] - A callback function that gets called when the animation finishes playing.
     * @param {boolean} [options.reverse] - Play the animation in reverse.
     * @param {boolean} [options.composite] - Whether to play the animation simultaneously with other animations.
     * @param {boolean} [options.immediate] - Whether to immediately play the animation, will override other playing animations when `composite` is `false`.
     * @param {number} [options.delay] - Delay the animation by some amount in seconds.
     */
    play(animation: string, { callback, reverse, composite, immediate, delay }?: {
        callback?: Function;
        reverse?: boolean;
        composite?: boolean;
        immediate?: boolean;
        delay?: number;
    }, delegate?: boolean): number;

    /**
     * Stop playing all currently playing animations.
     */
    stop(): void;

    private prerender;

}