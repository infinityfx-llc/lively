import React from 'react';

/**
 * Returns a `Function`, which can be passed as an animation value for the `translate` property, that describes the motion along a referenced `SVGElement`'s path.
 * 
 * @param {number[]} [offset=[0, 0]] - Offset the path's position by some amount along the x and y axis in pixels.
 * @param {number} [scale=1] - Scale the size of the path some amount.
 */
export function usePath(offset?: number[], scale?: number): [Function, React.Ref<SVGElement>];