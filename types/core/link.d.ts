export type Link = {

    set: (val: any, duration?: number) => void;

}

/**
 * A reactive `Function` which returns it currently stored value.
 * 
 * @param {Function} transformer - A function which transforms the `Link` value before returning it.
 */
export function Link(transformer?: (val: any) => any): any;