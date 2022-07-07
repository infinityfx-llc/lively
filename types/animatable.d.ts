import React from 'react';

declare interface Animatable {
    stagger?: number;
    viewportMargin?: number;
    animate?: object;
    initial?: object;
    animations?: object;
    noCascade?: boolean;
    onMount?: string | boolean;
    onUnmount?: string | boolean;
    whileViewport?: string | boolean;
    whileHover?: string | boolean;
    whileFocus?: string | boolean;
}

export class Animatable extends React.Component<Animatable> {

    private toAnimation;

    private countNestedLevels;

    private inViewport;

    private onScroll;

    private onEnter;

    private onLeave;

    private onFocus;

    private onBlur;

    private onClick;

    setInitial(animationName: string, reset?: boolean): Promise<void>;

    play(animationName: string, { callback, reverse, immediate, cascade, groupAdjust, cascadeDelay, staggerDelay }?: {
        callback?: Function;
        reverse?: boolean;
        immediate?: boolean;
        cascade?: boolean;
        groupAdjust?: number;
        cascadeDelay?: number;
        staggerDelay?: number;
    }): Promise<void>;

    private style;

    private mergeProperties;

    private deepClone;

}