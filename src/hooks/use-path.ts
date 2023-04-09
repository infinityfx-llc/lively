'use client';

import { useRef, useCallback } from 'react';

export default function usePath(): [(transform: (value: [number, number]) => any) => (progress: number) => any, React.Ref<SVGPathElement>] {
    const ref = useRef<SVGPathElement>(null);

    const link = useCallback((transform: (value: [number, number]) => any) => {
        return (progress: number) => {
            if (!ref.current) return transform([0, 0]);

            const len = ref.current.getTotalLength() * progress;
            const { x, y } = ref.current.getPointAtLength(len);

            return transform([x, y]);
        };
    }, [ref]);

    return [link, ref];
}