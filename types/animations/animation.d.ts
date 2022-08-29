import { AnimationInitials, AnimationProperties } from '../globals';

export type Animation = {

    create(getProperties?: () => [AnimationProperties, AnimationInitials]): Animation;

    isAnimation(animation: any): boolean;

}