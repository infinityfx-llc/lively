import React, { useId, useLayoutEffect, useMemo, useRef } from "react";
import Animator from "./core/animator";
import { getRemovedAnimators } from "./core/utils2";

export default function LayoutGroup({
    children,
    skipInitialMount = false
}: {
    children: React.ReactNode;
    skipInitialMount?: boolean;
}) {
    const id = useId();
    const timeout = useRef(0);
    const content = useRef(children);
    const animators = useMemo(() => {
        // register layout group with state

        return [] as Animator<any>[];
    }, []);

    const animatorIds = new Set<string>();
    for (const animator of animators) animatorIds.add(animator.id); // optimize
    const removed = getRemovedAnimators(children, animatorIds);

    if (removed.length) {
        // animators that remounted during unmount should play mount animation
        
        // play unmount
    }

    clearTimeout(timeout.current);
    if (timeout.current === null) {
        timeout.current = setTimeout(() => {

            content.current = children;
            // force update
        }, 1000);
    } else {
        // newly mounted animators should prevent mount here?

        content.current = children;
    }

    useLayoutEffect(() => {
        animators.forEach(animator => animator.transition());

        return () => clearTimeout(timeout.current);
    });

    return content.current;
}