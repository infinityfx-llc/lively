import { useCallback, useRef } from 'react';

export default function usePath(offset = [0, 0], scale = 1) {
    const ref = useRef();

    const translate = useCallback((t, te) => {
        if (!ref.current) return { x: 0, y: 0 };

        const d = ref.current.getTotalLength() * t / te;
        const { x, y } = ref.current.getPointAtLength(d);

        return { x: offset[0] + x * scale, y: offset[1] + y * scale };
    }, [ref]);

    return [translate, ref];
}