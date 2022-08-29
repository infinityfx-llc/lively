import React from 'react';
import { Animatable } from '../animatable';
import { Animate } from '../animate/animate';

/**
 * Returns a boolean value which dictates whether the referenced component should be mounted or not and allows for animating the respective component when it unmounts.
 * 
 * @param initial whether the referenced component is initially mounted.
 */
export function useUnmount(initial: boolean): [boolean, (mounted: boolean) => void, React.Ref<Animatable | Animate>];