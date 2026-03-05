'use client';

import React, { createContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { filterRemovedAnimators } from "./core/utils2";
import { forEachAnimator, registerLayoutGroup, unregisterLayoutGroup } from "./core/state";

export const LayoutGroupContext = createContext<string>('');

export default function LayoutGroup({
    children,
    skipInitialMount = false
}: {
    children: React.ReactNode;
    skipInitialMount?: boolean;
    mode?: 'wait' | 'swap'; // todo
}) {
    const id = '_lg' + useId();
    const timeout = useRef(0);
    const unmountingEnds = useRef(0);
    const content = useRef(children);
    const { animators } = useMemo(() => registerLayoutGroup(id), []);
    const [_, forceUpdate] = useState(0);

    const removed = filterRemovedAnimators(children, new Set(animators));

    if (removed.size) {
        let elapsed = 0;
        forEachAnimator(removed, animator => {
            if (animator.state === 'mounted') {
                elapsed = Math.max(elapsed, animator.trigger('unmount')); // add cascade reverse option here
                animator.state = 'unmounting';
                animator.dispatch('unmount');
            }
        });

        unmountingEnds.current = Math.max(unmountingEnds.current, Date.now() + elapsed * 1000);
    }

    clearTimeout(timeout.current);
    const unmountingDelay = unmountingEnds.current - Date.now();

    if (unmountingDelay > 0) {
        forEachAnimator(animators, animator => {
            if (animator.state === 'unmounting' && !removed.has(animator.id)) animator.mount();
        });

        timeout.current = setTimeout(() => {

            content.current = children;
            forceUpdate(n => n + 1);
        }, unmountingDelay);
    } else {
        // newly mounted animators should prevent mount here?

        content.current = children;
    }

    useLayoutEffect(() => {
        forEachAnimator(animators, animator => animator.transition());
    });

    useEffect(() => {
        return () => {
            unregisterLayoutGroup(id);
            clearTimeout(timeout.current);
        }
    }, []);

    return <LayoutGroupContext value={id}>
        {content.current}
    </LayoutGroupContext>;
}