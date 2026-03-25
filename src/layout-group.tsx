'use client';

import React, { createContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { filterRemovedAnimators, getRemovedAnimators } from "./core/utils";
import { forEachAnimator, registerLayoutGroup, unregisterLayoutGroup } from "./core/state";

export const LayoutGroupContext = createContext<string>('');

export default function LayoutGroup({
    children,
    skipInitialMount = false,
    mode = 'wait'
}: {
    children: React.ReactNode;
    skipInitialMount?: boolean;
    mode?: 'wait' | 'sync';
}) {
    const id = '_lg' + useId();
    const timeout = useRef(0);
    const content = useRef(children);
    const data = registerLayoutGroup(id, skipInitialMount);
    const [_, forceUpdate] = useState(0);

    const removed = filterRemovedAnimators(children, new Set(data.animators), `${id}_la_`);

    if (removed.size) {
        if (mode === 'sync') { // only works for non-nested children
            const updated = Array.isArray(children) ? children.slice() : [children];

            for (const [index, element] of getRemovedAnimators(content.current, removed)) {
                updated.splice(index, 0, element);
            }

            content.current = updated;
        }

        forEachAnimator(removed, animator => {
            if (animator.state === 'mounted') {
                const delay = animator.trigger('unmount', { cascade: 'reverse', composite: 'override' });
                animator.delayUnmountUntil = Date.now() + 1000 * delay;

                if (delay) {
                    animator.state = 'unmounting';
                    animator.dispatch('unmount');
                }
            }
        });
    }

    let endsAt = 0;
    forEachAnimator(data.animators, animator => endsAt = Math.max(endsAt, animator.delayUnmountUntil));
    const unmountingDelay = endsAt - Date.now();
    clearTimeout(timeout.current);

    if (unmountingDelay > 0) {
        forEachAnimator(data.animators, animator => {
            if (animator.state === 'unmounting' && !removed.has(animator.id)) {
                animator.trigger('mount', { override: true });
                animator.state = 'mounted';
            }
        });

        timeout.current = setTimeout(() => {

            content.current = children;
            forceUpdate(n => n + 1);
        }, unmountingDelay);
    } else
        if (mode === 'wait') {
            content.current = children;
        }

    useLayoutEffect(() => {
        forEachAnimator(data.animators, animator => {
            if (animator.state === 'mounted' && !animator.isMounting) animator.transition();

            animator.isMounting = false;
        });
    }, [children]);

    useEffect(() => {
        data.skipInitialMount = false;

        return () => {
            unregisterLayoutGroup(id);
            clearTimeout(timeout.current);
        }
    }, []);

    return <LayoutGroupContext value={id}>
        {content.current}
    </LayoutGroupContext>;
}