import { useRef, useCallback } from 'react';

export default function usePath(): [(transform: (value: [number, number], index: number) => any) => (progress: number, index: number) => any, React.Ref<SVGPathElement>] {
    const ref = useRef<SVGPathElement>(null);

    const link = useCallback((transform: (value: [number, number], index: number) => any) => {
        return (progress: number, index: number) => {
            if (!ref.current) return transform([0, 0], index);

            const len = ref.current.getTotalLength() * progress;
            const { x, y } = ref.current.getPointAtLength(len);

            return transform([x, y], index);
        };
    }, [ref]);

    return [link, ref];
}