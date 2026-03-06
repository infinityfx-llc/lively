'use client';

import { useLayoutEffect } from "react";
import useLink from "./use-link";

export default function useScroll<T extends HTMLElement>(target?: React.RefObject<T>) {
    const link = useLink({ x: 0, y: 0 });

    useLayoutEffect(() => {
        const ctrl = new AbortController();
        const element = target?.current ? target.current : window;

        function update() {
            const element = target?.current || document.documentElement;

            link.set({
                x: element.scrollLeft / ((element.scrollWidth - element.clientWidth) || 1),
                y: element.scrollTop / ((element.scrollHeight - element.clientHeight) || 1)
            });
            // ^ should have duration 0
        }

        update();

        element.addEventListener('scroll', update, { signal: ctrl.signal });

        return () => ctrl.abort();
    }, [target]);

    return link;
}