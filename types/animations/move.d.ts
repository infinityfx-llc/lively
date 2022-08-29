import { AnimationProperties } from '../globals';
import { Animation } from './animation';

interface MoveOptions extends AnimationProperties {

    /**
     * The direction to move the `element` to.
     * 
     * @default "up"
     */
    direction: 'up' | 'left' | 'down' | 'right';
}

/**
 * Move and simultaneously fade the `element` along an axis over a duration of 0.5 seconds.
 * 
 * @type {Animation}
 */
export function Move(options: MoveOptions): this