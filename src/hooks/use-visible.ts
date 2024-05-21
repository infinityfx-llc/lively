'use client';

import { useRef } from "react";
import useTrigger, { Trigger } from "./use-trigger";
import useViewport from "./use-viewport";

export default function useVisible<T extends Element = any>({ enter = 1, exit = false, threshold = .5 }: {
    enter?: boolean | number;
    exit?: boolean | number;
    threshold?: number;
} = {}): [Trigger, React.Ref<T>] {
    const [link, ref] = useViewport(threshold);
    const state = useRef({
        visible: false,
        enters: enter === true ? Infinity : +enter,
        exits: exit === true ? Infinity : +exit,
    });
    const trigger = useTrigger();

    link.subscribe(() => { // probably double calls only re-render (cause garbage collector doesn't remove old function immediately)
        const [x, y] = link();
        const intersecting = x > 0 && x < 1 && y > 0 && y < 1;
        const { visible, enters, exits } = state.current;

        if (!visible && intersecting && enters) state.current.enters--, trigger();
        if (visible && !intersecting && exits) state.current.exits--, trigger();

        state.current.visible = intersecting;
    });

    return [trigger, ref];
}