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

    private update;

    private toAnimation;

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