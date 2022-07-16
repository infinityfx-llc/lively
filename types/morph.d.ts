import React from 'react';

declare interface Morph {
    active?: boolean;
    group?: number;
    useLayout?: boolean;
    interpolate?: string;
    duration?: number;
    ignore?: string[];
}

export class Morph extends React.Component<Morph> {

    private static properties;
    private static layoutProperties;

    private layoutUpdate;

    private update;

    private setUniqueId;

    private morph;

    private createAnimations;

    private createAnimation;

    private createMorphAnimation;

    private createUnmorphAnimation;

    private getChildren;

}