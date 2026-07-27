'use client';

import { useEffect, useRef, useState } from "react";

/**
 * @returns A tupple of a `React.Ref` to attach to an element and an `boolean` hover state.
 */
export default function useHover<T extends HTMLElement = any>() {
    const ref = useRef<T>(null);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const ctrl = new AbortController();

        ref.current.addEventListener('mouseenter', () => setHovering(true), { signal: ctrl.signal });
        ref.current.addEventListener('mouseleave', () => setHovering(false), { signal: ctrl.signal });

        return () => ctrl.abort();
    }, []);

    return [ref, hovering] as const;
}