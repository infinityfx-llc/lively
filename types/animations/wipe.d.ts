import { Animation } from './animation';
import { AnimationProperties } from '../globals';

interface WipeOptions extends AnimationProperties {

    /**
     * The direction to wipe the `element` to.
     * 
     * @default "right"
     */
    direction: 'up' | 'left' | 'down' | 'right';
}

/**
 * Wipe the `element` along an axis over a duration of 1 seconds.
 * 
 * @type {Animation}
 */
export function Wipe(options: WipeOptions): this;