import { useCallback, useRef } from 'react';

export default function usePath() {
    const ref = useRef();

    const translate = useCallback((t, te) => {
        if (!ref.current) return { x: 0, y: 0 };

        const d = ref.current.getTotalLength() * t / te;
        const { x, y } = ref.current.getPointAtLength(d);

        return { x, y };
    }, [ref]);

    return [translate, ref];
}