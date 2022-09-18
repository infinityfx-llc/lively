import { Link } from '../core/link';

/**
 * Returns a `Link`, which can be used as an animation value.
 * 
 * @param {any} initial - The initial value for the `Link`.
 */
export function useLink(initial: any): [Link, Link.set];