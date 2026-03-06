'use client';

import { useLayoutEffect } from "react";
import useLink from "./use-link";

export default function useScroll<T extends HTMLElement>(target?: React.RefObject<T>) {
    const link = useLink({ x: 0, y: 0, top: 0, left: 0 });

    useLayoutEffect(() => {
        const ctrl = new AbortController();
        const element = target?.current ? target.current : window;

        function update() {
            const element = target?.current || document.documentElement;

            const left = element.scrollLeft,
                x = left / ((element.scrollWidth - element.clientWidth) || 1);
            const top = element.scrollTop,
                y = top / ((element.scrollHeight - element.clientHeight) || 1);

            link.set({ x, y, top, left }, {
                duration: 0
            });
        }

        update();

        element.addEventListener('scroll', update, { signal: ctrl.signal });
        
        return () => ctrl.abort();
    }, [target]);

    return link;
}