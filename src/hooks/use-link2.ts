'use client';

import { useEffect, useRef } from "react";
import AnimationLink from "../core/animation-link";

export default function useLink<T>(initial: T): AnimationLink<T>;
export default function useLink<T, K = T>(initial: AnimationLink<T>, transform: (value: T, index: number) => K): AnimationLink<K>;
export default function useLink<T, K = T>(initial: T | AnimationLink<T>, transform?: (value: T, index: number) => K) {
    const callback = transform || (value => value);

    const isLink = initial instanceof AnimationLink;
    const ref = useRef(isLink ?
        new AnimationLink(callback(initial.get(), 0), (index: number) => {
            return callback(initial.get(index), index);
        }) :
        new AnimationLink(initial)
    );

    useEffect(() => {
        if (!isLink) return;

        return initial.on('change', () => ref.current.dispatch('change'));
    }, []);

    return ref.current;
}