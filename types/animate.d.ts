import React from 'react';
import { AnimatableProps } from '../animatable';
import { Animation } from '../animations/animation';

interface AnimateProps extends AnimatableProps {

    /**
     * An array of `Animation` objects that defines what animation to apply to element depending on it's level.
     * 
     * @default [Move, Pop]
     */
    animations?: Animation[];

    /**
     * How many levels of `elements` to animate.
     * 
     * @default 1
     */
    levels?: number;
}

export class Animate extends React.Component<AnimateProps> {

    private makeAnimatable;

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

}