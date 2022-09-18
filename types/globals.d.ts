import React from 'react';

type TranslateProperty = { x?: number; y?: number; } | string;

type ScaleProperty = { x?: number; y?: number; } | string | number;

type ClipProperty = {
    left?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
}

export interface AnimationInitials extends React.CSSProperties {
    /**
     * Define the position of an `element` relative to initial rendered position.
     * 
     * @default { x: 0, y: 0 }
     */
    translate?: TranslateProperty;

    /**
     * @default { x: 1, y: 1 }
     */
    scale?: ScaleProperty;

    /**
     * @default 0
     */
    rotate?: number | string;

    /**
     * @default { left: 0, top: 0, right: 0, bottom: 0 }
     */
    clip?: ClipProperty;

    /**
     * Value between `0` and `1` which defines how much of an `SVGElement`'s stroke is shown.
     * 
     * @default 1
     */
    length?: number;
}

export interface AnimationProperties extends AnimationInitials {

    /**
     * Delay of the animation in seconds.
     * 
     * @default 0
     */
    delay?: number;

    /**
     * Duration of animation in seconds.
     * 
     * @default 1
     */
    duration?: number;

    /**
     * Number of times to repeat the animation.
     * 
     * Accepts `Infinity` as a value to loop the animation indefinitely.
     * 
     * @default 1
     */
    repeat?: number;

    /**
     * Whether to alternate the animation direction (reversed) on repeats.
     * 
     * @default false
     */
    alternate?: boolean;

    /**
     * Interpolation method used between keyframes.
     * 
     * @default "ease"
     */
    interpolate?: 'constant' | 'linear' | 'ease' | 'spring';

    /**
     * Alias for `transform-origin`.
     * 
     * @default { x: 0.5, y: 0.5 }
     */
    origin?: string | { x?: number, y?: number } | number;
}