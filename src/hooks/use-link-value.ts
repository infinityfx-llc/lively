import { useEffect, useRef } from "react";
import LinkValue from "../core/link-value";

export default function useLinkValue<T>(initial: T): LinkValue<T>;
export default function useLinkValue<T, K = T>(initial: LinkValue<T>, transform: (value: T, index: number) => K): LinkValue<K>;
export default function useLinkValue<T, K = T>(initial: T | LinkValue<T>, transform?: (value: T, index: number) => K) {
    const isLink = initial instanceof LinkValue;
    const ref = useRef(isLink ?
        new LinkValue(initial.get()[0], (index: number) => {
            const [value] = initial.get(index);

            return (transform || (value => value))(value, index);
        }) :
        new LinkValue(initial)
    );

    useEffect(() => {
        if (!isLink) return;

        return initial.on('change', () => ref.current.dispatch('change'));
    }, []);

    return ref.current;
}