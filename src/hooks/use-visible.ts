import { useLayoutEffect, useRef, useState } from "react";
import useViewport from "./use-viewport";

export default function useVisible(threshold = .5) {
    const visible = useRef(false);
    const [ref, link] = useViewport(threshold);
    const [entered, setEntered] = useState(0);
    const [exited, setExited] = useState(0);

    useLayoutEffect(() => {
        const t = link.on('change', ({ x, y }) => {
            const intersecting = x > 0 && x < 1 && y > 0 && y < 1;

            if (!visible.current && intersecting) setEntered(entered + 1);
            if (visible.current && !intersecting) setExited(exited + 1);

            visible.current = intersecting;
        });

        return t;
    }, [entered, exited]);

    return [ref, entered, exited] as const;
}