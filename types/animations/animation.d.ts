import { AnimationInitials, AnimationProperties } from '../globals';

export type Animation = {

    /**
     * Creates a new `Animation` based on a `Function` that returns a tuple of animation properties and initials.
     */
    create(getProperties?: () => [AnimationProperties, AnimationInitials]): Animation;

    /**
     * Check whether something is an instance of `Animation`.
     */
    isAnimation(animation: any): boolean;

}