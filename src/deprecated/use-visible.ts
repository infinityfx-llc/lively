'use client';

import { useEffect, useRef } from "react";
import useTrigger, { Trigger } from "./use-trigger";
import useViewport from "./use-viewport";

export default function useVisible<T extends Element = any>({ enter = 1, exit = false, threshold = .5 }: {
    enter?: boolean | number;
    exit?: boolean | number;
    threshold?: number;
} = {}): [React.Ref<T>, Trigger, Trigger] {
    const [ref, link] = useViewport(threshold);
    const visible = useRef(false);
    const enters = useTrigger();
    const exits = useTrigger();

    useEffect(() => {
        function linkupdate() {
            const [x, y] = link();
            const intersecting = x > 0 && x < 1 && y > 0 && y < 1;
    
            if (!visible.current && intersecting && enters.called < (enter === true ? Infinity : +enter)) enters();
            if (visible.current && !intersecting && exits.called < (exit === true ? Infinity : +exit)) exits();
    
            visible.current = intersecting;
        }

        linkupdate();
        link.subscribe(linkupdate);

        return () => link.unsubscribe(linkupdate);
    }, [enters, exits]);

    return [ref, enters, exits];
}