'use client';

import { use, useLayoutEffect, useRef } from "react";
import Animatable, { AnimatableContext, AnimatableType, AnimatableProps } from "../animatable";
import { combineRefs } from "../core/utils";
import Timeline from "../core/timeline";
import { TransitionOptions } from "../core/track";

export const Groups: {
    [key: string]: Map<Timeline, {
        state: 'mounted' | 'unmounted' | 'collected';
    }>;
} = {};

/**
 * Peform layout morphs between components when one mounts and unmount.
 * 
 * @see {@link https://lively.infinityfx.dev/docs/components/morph}
 */
export default function Morph({ children, group, transition, ...props }: {
    /**
     * Global identifier, components with the same group will morph between eachother.
     */
    group: string;
    transition?: Omit<TransitionOptions, 'reverse'>;
} & AnimatableProps) {
    const parent = use(AnimatableContext);
    const id = parent?.group ? `${parent.group}.${group}` : group;
    if (!(id in Groups)) Groups[id] = new Map();

    const ref = useRef<AnimatableType | null>(null);

    useLayoutEffect(() => {
        const timeline = ref.current?.timeline;
        if (!timeline) return;

        if (!Groups[id].has(timeline)) {
            Groups[id].set(timeline, { state: 'mounted' });
        } else {
            const entry = Groups[id].get(timeline) as any;
            entry.state = 'mounted';
        }

        const targets = Array.from(Groups[id].entries());
        const target = targets.find(([_, data]) => data.state === 'unmounted');

        if (target && !timeline.mounted) {
            timeline.transition(target[0], transition);
            target[1].state = 'collected';
        } else
            if (!timeline.mounted) {
                ref.current?.trigger('mount');
            }

        timeline.mounted = true;

        return () => {
            const entry = Groups[id].get(timeline) as any;
            entry.state = 'unmounted';
            setTimeout(() => entry.state = 'collected', 1);
        };
    }, []);

    return <Animatable {...props} group={id} manual ref={combineRefs(ref, props.ref)}>
        {children}
    </Animatable>;
}

Morph.isLively = true;