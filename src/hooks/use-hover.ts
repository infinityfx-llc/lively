'use client';

import { useEffect, useRef, useState } from "react";

export default function useHover<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const ctrl = new AbortController();

        ref.current.addEventListener('mouseenter', () => setHovering(true), { signal: ctrl.signal });
        ref.current.addEventListener('mouseleave', () => setHovering(false), { signal: ctrl.signal });

        return () => ctrl.abort();
    }, []);

    return [ref, hovering];
}