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

    play(animationName: string, { callback, reverse, immediate, cascade, groupAdjust, cascadeDelay, staggerDelay }?: {
        callback?: Function;
        reverse?: boolean;
        immediate?: boolean;
        cascade?: boolean;
        groupAdjust?: number;
        cascadeDelay?: number;
        staggerDelay?: number;
    }): Promise<void>;

}