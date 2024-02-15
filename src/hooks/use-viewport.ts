'use client';

import { useEffect, useRef } from "react";
import useLink, { Link } from "./use-link";

export default function useViewport<T extends Element = any>(threshold = .5): [Link<[number, number]>, React.Ref<T>] {
    const ref = useRef<T>(null);
    const link = useLink<[number, number]>([-1, -1]);

    useEffect(() => {
        function update() {
            if (!ref.current) return;

            const { x, y, width, height } = ref.current.getBoundingClientRect();
            
            link.set([
                (x + width * threshold) / (window.innerWidth + 2 * width * (threshold - .5)),
                (y + height * threshold) / (window.innerHeight + 2 * height * (threshold - .5))
            ]);
        }

        update();

        window.addEventListener('scroll', update);
        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        }
    }, [threshold]);

    return [link, ref];
}