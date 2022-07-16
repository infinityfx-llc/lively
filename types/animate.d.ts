import React from 'react';

declare interface Animate {
    stagger?: number;
    viewportMargin?: number;
    animations?: array;
    onMount?: string | boolean;
    onUnmount?: string | boolean;
    whileViewport?: string | boolean;
    whileHover?: string | boolean;
    whileFocus?: string | boolean;
    levels?: number;
}

export class Animate extends React.Component<Animate> {

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