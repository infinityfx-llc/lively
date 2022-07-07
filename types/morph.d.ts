import React from 'react';

declare interface Morph {
    active?: boolean;
    group?: number;
    useLayout?: boolean;
}

export class Morph extends React.Component<Morph> {

    private getParentPosition;

    private positionKeyframes;

    private scaleKeyframes;

    private createMorphAnimation;

    private createResetAnimation;

    private parentStyle;

    private childStyle;

    private getChildren;

}