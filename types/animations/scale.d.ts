import { AnimationProperties } from '../globals';
import { Animation } from './animation';

interface ScaleOptions extends AnimationProperties {

    /**
     * The direction to scale the `element` up to.
     * 
     * @default "right"
     */
    direction: 'up' | 'left' | 'down' | 'right';
}

/**
 * Scale the `element` along an axis over a duration of 0.6 seconds.
 * 
 * @type {Animation}
 */
export function Scale(options: ScaleOptions): this;