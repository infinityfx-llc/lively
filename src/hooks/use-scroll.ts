'use client';

import useLink from "./use-link";
import useMountEffect from "./use-mount-effect";

export default function useScroll<T extends HTMLElement>({ restore = 0, target }: {
    restore?: number;
    target?: React.RefObject<T>;
} = {}) {
    const link = useLink({ x: 0, y: 0, top: 0, left: 0 });

    useMountEffect(() => {
        const element = target?.current ? target.current : window;

        function update(duration?: number) {
            const element = target?.current || document.documentElement;

            const left = element.scrollLeft, x = left / ((element.scrollWidth - element.clientWidth) || 1);
            const top = element.scrollTop, y = top / ((element.scrollHeight - element.clientHeight) || 1);

            link.set({ x, y, top, left }, { duration });
        }

        update(restore);

        const scroll = () => update();

        element.addEventListener('scroll', scroll);
        return () => element.removeEventListener('scroll', scroll);
    }, [target]);

    return link;
}