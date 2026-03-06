'use client';

import { useLayoutEffect, useRef } from "react";
import useLink from "./use-link";

export default function useViewport<T extends Element = Element>(threshold = .5) {
    const ref = useRef<T>(null);
    const link = useLink({ x: -1, y: -1 });

    useLayoutEffect(() => {
        const ctrl = new AbortController();

        function update() {
            if (!ref.current) return;

            const { x, y, width, height } = ref.current.getBoundingClientRect();

            link.set({
                x: (x + width * threshold) / (window.innerWidth + 2 * width * (threshold - .5)),
                y: (y + height * threshold) / (window.innerHeight + 2 * height * (threshold - .5))
            }, { duration: 0 });
        }

        update();

        window.addEventListener('scroll', update, { signal: ctrl.signal });
        window.addEventListener('resize', update, { signal: ctrl.signal });

        return () => ctrl.abort();
    }, [threshold]);

    return [ref, link] as const;
}