import { useRef } from "react";

type ChangeListener = (dt: number) => void;
type Transformer<T, P = any> = (val: T, index: number) => P;
export type Link<T> = {
    <P = any>(transform: Transformer<T, P>): Link<ReturnType<Transformer<T, P>>>;
    (index?: number): T;
    onchange: (callback: ChangeListener) => void;
    offchange: (callback: ChangeListener) => void;
    set: (value: T, transition?: number) => void;
};

export function isLink<T>(val: any): val is Link<T> {
    return (<Link<T>>val).onchange !== undefined;
}

export default function useLink<T = any>(initial: T) {
    const listeners = useRef<Set<ChangeListener>>(new Set());
    const valueRef = useRef(initial);

    function onchange(callback: ChangeListener) {
        listeners.current.add(callback);
    }

    function offchange(callback: ChangeListener) {
        listeners.current.delete(callback);
    }

    function set(value: T, transition = 0) {
        valueRef.current = value;

        listeners.current.forEach(cb => cb(transition));
    }

    function create(transform: Transformer<T> = val => val): Link<T> {

        const link = function (this: { transform: Transformer<T>; }, transform?: Transformer<T> | number) {
            if (transform instanceof Function) return create(transform);

            return this.transform(valueRef.current, transform || 0);
        }.bind({ transform }) as Link<T>;

        link.onchange = onchange;
        link.offchange = offchange;
        link.set = set;

        return link;
    }

    return create();
}