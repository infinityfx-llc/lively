'use client';

import { useLayoutEffect, useRef, useState } from "react";
import useViewport from "./use-viewport";

/**
 * @returns A tupple of a `React.Ref` to attach to an element, a `number` counting the number of times the element has entered the viewport and a `number` counting the number of times the element has left the viewport.
 */
export default function useVisible<T extends Element = any>(
    /**
     * @default .5
     */
    threshold = .5
) {
    const visible = useRef(false);
    const [ref, link] = useViewport<T>(threshold);
    const [entered, setEntered] = useState(0);
    const [exited, setExited] = useState(0);

    useLayoutEffect(() => {
        const off = link.on('change', ({ x, y }) => {
            const intersecting = x > 0 && x < 1 && y > 0 && y < 1;

            if (!visible.current && intersecting) setEntered(entered + 1);
            if (visible.current && !intersecting) setExited(exited + 1);

            visible.current = intersecting;
        });

        link.dispatch('change');

        return off;
    }, [entered, exited]);

    return [ref, entered, exited] as const;
}