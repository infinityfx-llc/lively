import React from 'react';

type PositionProperty = { x?: number; y?: number; } | string;

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
    position?: PositionProperty;

    /**
     * @default { x: 1, y: 1 }
     */
    scale?: ScaleProperty;

    /**
     * @default 0
     */
    rotation?: number;

    /**
     * @default { left: 0, top: 0, right: 0, bottom: 0 }
     */
    clip?: ClipProperty;

    /**
     * Whether to render the `element`.
     * An alias for the `display` property which maps `true` to `""` and `false` to `"none"`.
     * 
     * @default true
     */
    active?: boolean;

    /**
     * Whether to allow mouse interactions with the `element`. 
     * An alias for the `pointerEvents` property which maps `true` to `""` and `false` to `"none"`.
     * 
     * @default true
     */
    interact?: boolean;

    /**
     * Value between `0` and `1` which defines how much of an `<svg>` element stroke is shown.
     * 
     * @default 1
     */
    strokeLength?: number;
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
    interpolate?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end' | 'spring';

    /**
     * @default { x: 0.5, y: 0.5 }
     */
    origin?: string | { x?: number, y?: number } | number;

    /**
     * @default false
     */
    useLayout?: boolean;
}