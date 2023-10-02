import { useRef } from "react";

type ChangeListener = (dt: number) => void;
type Transformer<T, P = any> = (val: T, index: number) => P;
export type Link<T> = {
    <P = any>(transform: Transformer<T, P>): Link<ReturnType<Transformer<T, P>>>;
    (index?: number): T;
    onchange: (callback: ChangeListener) => void;
    set: (value: T, transition?: number) => void;
    time: () => number;
};

export default function useLink<T = any>(initial: T) {
    const listners = useRef<Set<ChangeListener>>(new Set());
    // const link = useRef({
    //     value: initial,
    //     prev: initial,
    //     t: Date.now(),
    //     dt: 0
    // });
    const valueRef = useRef(initial);

    function onchange(callback: ChangeListener) {
        listners.current.add(callback);
    }

    // function onchange(link: Link<T>, callback: ChangeListener) {
    //     listners.current.add(callback.bind({}, link));
    // }

    // function time() {
    //     return Math.max(link.current.t - Date.now(), 0);
    // }

    // function get() {
    //     const { value, prev, dt } = link.current;
    //     let x = time() / (dt || 1);
    //     x = (1 - Math.cos(x * Math.PI)) / 2;

    //     return prev * x + value * (1 - x);
    // }

    function set(value: T, transition = 0) {
        // link.current = {
        //     value,
        //     prev: get(),
        //     dt: transition * 1000,
        //     t: transition * 1000 + Date.now()
        // };
        valueRef.current = value;

        listners.current.forEach(cb => cb(transition));
    }

    function createLink(transform: Transformer<T> = val => val): Link<T> {

        const link = function (this: { transform: Transformer<T>; }, transform?: Transformer<T> | number) {
            if (transform instanceof Function) return createLink(transform);

            return this.transform(valueRef.current, transform || 0);
            // return this.transform(get(), transform || 0);
        }.bind({ transform }) as Link<T>;

        link.onchange = onchange;
        // link.onchange = onchange.bind({}, link);
        // link.time = time;
        link.set = set;

        return link;
    }

    return createLink();
}