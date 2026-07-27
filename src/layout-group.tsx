'use client';

import React, { createContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { filterRemovedAnimators, getRemovedAnimators, hasMountedMorphTarget, warnConsoleOnce } from "./core/utils";
import { forEachAnimator } from "./core/state";

export type LayoutGroupData = {
    animators: Set<string>;
    skipInitialMount: boolean;
};

export const LayoutGroupContext = createContext<LayoutGroupData | null>(null);

export default function LayoutGroup({
    children,
    skipInitialMount = false,
    mode = 'wait',
    ignoreWarnings = false
}: {
    children: React.ReactNode;
    /**
     * Whether to skip playing the mount animation for any child `Animate` elements, when the `LayoutGroup` first mounts.
     * 
     * @default false
     */
    skipInitialMount?: boolean;
    /**
     * Whether to wait for unmount animations to finish playing before playing any newly mounted `Animate` mount animations.
     * 
     * @default 'wait'
     */
    mode?: 'wait' | 'sync';
    /**
     * Suppress missing child `Animate` key warnings.
     * 
     * @default false
     */
    ignoreWarnings?: boolean;
}) {
    const id = '_lg' + useId();
    const timeout = useRef<any>(0);
    const content = useRef(children);
    const [updates, forceUpdate] = useState(0);

    const data = useRef<LayoutGroupData | null>(null);
    if (!data.current) data.current = {
        animators: new Set(),
        skipInitialMount
    };

    const { animators } = data.current;

    const [removed, hasDynamicKeys] = filterRemovedAnimators(children, new Set(animators), id);

    if (hasDynamicKeys && !ignoreWarnings) warnConsoleOnce(id, `One or more <Animate> components under <LayoutGroup> is missing an explicit \`key\` prop`);

    if (mode === 'sync') { // only works for non-nested children
        const updated = Array.isArray(children) ? children.slice() : [children];

        if (removed.size) {
            for (const [index, element] of getRemovedAnimators(content.current, removed, id)) {
                updated.splice(index, 0, element);
            }
        }

        content.current = updated;
    }

    if (removed.size) {
        forEachAnimator(removed, animator => {
            if (animator.state === 'mounted') {
                if (hasMountedMorphTarget(children, animator.morphId)) return; // doesn't work if new morph is outside layoutgroup..

                const delay = animator.trigger('unmount', { cascade: 'reverse', composite: 'override' });
                animator.delayUnmountUntil = performance.now() + 1000 * delay;

                if (delay) {
                    animator.state = 'unmounting';
                    animator.dispatch('unmount');
                }
            }
        });
    }

    let endsAt = 0;
    forEachAnimator(animators, animator => endsAt = Math.max(endsAt, animator.delayUnmountUntil));
    const unmountingDelay = endsAt - performance.now();
    clearTimeout(timeout.current);

    forEachAnimator(animators, animator => {
        if (animator.state === 'unmounting' && !removed.has(animator.id)) {
            animator.stop();
            animator.trigger('mount', { override: true });
            animator.state = 'mounted';
        }
    });

    if (unmountingDelay > 0) {
        timeout.current = setTimeout(() => {
            content.current = children;
            forceUpdate(n => n + 1);
        }, unmountingDelay);
    } else
        if (mode === 'wait') {
            content.current = children;
        }

    useLayoutEffect(() => {
        forEachAnimator(animators, animator => {
            if (animator.state === 'mounted' && !animator.isMounting) animator.transition();

            animator.isMounting = false;
        });
    }, [children, updates]);

    useEffect(() => {
        data.current!.skipInitialMount = false;
    }, []);

    useLayoutEffect(() => () => {
        clearTimeout(timeout.current);
        data.current!.skipInitialMount = skipInitialMount;
    }, []);

    return <LayoutGroupContext value={data.current}>
        {content.current}
    </LayoutGroupContext>;
}