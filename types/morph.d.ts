import React from 'react';

interface MorphProps {
    active?: boolean;
    group?: number;
    useLayout?: boolean;
    interpolate?: string;
    duration?: number;
    ignore?: string[];
}

export class Morph extends React.Component<MorphProps> {

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