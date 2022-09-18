import React from 'react';
import { AnimatableProps } from '../animatable';

interface MorphProps extends AnimatableProps {

    /**
     * @default false
     */
    active?: boolean;

    /**
     * @default ['translate', 'scale', 'rotate', 'opacity', 'borderRadius', 'backgroundColor', 'color', 'zIndex', 'pointerEvents']
     */
    include?: string[];

    /**
     * @default []
     */
    exclude?: string[];
}

export class Morph extends React.Component<MorphProps> {

    private static cascadingProps;

}