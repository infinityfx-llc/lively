'use client';

import { useEffect, useRef, useState } from "react";

/**
 * @returns A tupple of a `React.Ref` to attach to an element and an `boolean` pressing state.
 */
export default function useTap<T extends HTMLElement = any>() {
    const ref = useRef<T>(null);
    const [tapping, setTapping] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const ctrl = new AbortController();

        ref.current.addEventListener('pointerdown', () => setTapping(true), { signal: ctrl.signal });
        window.addEventListener('pointerup', () => setTapping(false), { signal: ctrl.signal });

        return () => ctrl.abort();
    }, []);

    return [ref, tapping] as const;
}