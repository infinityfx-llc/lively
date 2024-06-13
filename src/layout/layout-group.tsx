'use client';

import { Children, isValidElement, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import useMountEffect from "../hooks/use-mount-effect";
import type { TransitionOptions } from "../core/track";
import { Groups } from "./morph";

export default function LayoutGroup({ children, transition }: {
    children: React.ReactNode;
    transition?: Omit<TransitionOptions, 'reverse'>;
}) {
    const candidates = Children.toArray(children).filter(child => isValidElement(child)) as React.ReactElement<any>[];
    const ref = useRef<AnimatableType | null>(null);
    const [_, forceUpdate] = useState({});

    const awaiting = new Set<string>();
    const rendered = useRef<{
        child: React.ReactElement<any>;
        key: string;
    }[]>([]);
    const mounting = useRef(new Map<string, {
        child: React.ReactElement<any>;
        index: number;
    }>());

    const timeout = useRef<any>(undefined);
    const unmountDelay = useRef(0);
    const unmounting = useRef<Set<string>>(new Set());

    for (let i = 0; i < candidates.length; i++) {
        const child = candidates[i];

        const isLively = (child.type as any).isLively && 'id' in child.props;
        const key = isLively ? child.props.id : `__${i}`;

        const index = rendered.current.findIndex(({ key: childKey }) => childKey === key);
        if (index < 0) {
            mounting.current.set(key, { child, index: i });
        } else {
            rendered.current[index] = { child, key };
        }

        awaiting.add(key);
    }

    mounting.current.forEach((_, key) => {
        if (!awaiting.has(key)) mounting.current.delete(key);
    });

    for (const { key } of rendered.current) {
        if (!awaiting.has(key)) unmounting.current.add(key);
    }

    if (unmounting.current.size && ref.current) {

        for (const child of ref.current.children) {
            const id = child.current?.id as string,
                isUnmounting = unmounting.current.has(id);
                
            if (!child.current) continue;

            if (isUnmounting && awaiting.has(id)) {
                child.current.timeline.mounted = true;

                unmounting.current.delete(id);
            }

            if (isUnmounting && child.current.timeline.mounted) {
                const ends = Date.now() + child.current.trigger('unmount', { immediate: true }) * 1000;
                unmountDelay.current = Math.max(unmountDelay.current, ends);

                if (child.current.group) {
                    const morph = Groups[child.current.group].get(child.current.timeline);

                    if (morph) morph.state = 'unmounted';
                }

                child.current.timeline.mounted = false;
            }
        }

        const delay = unmountDelay.current - Date.now();
        clearTimeout(timeout.current);

        const afterUnmount = (update: boolean = true) => {
            unmounting.current.forEach(key => {
                const i = rendered.current.findIndex(({ key: childKey }) => childKey === key);
                rendered.current.splice(i, 1);
            });
            unmounting.current.clear();

            if (update) forceUpdate({});
        }

        if (delay > 0) {
            timeout.current = setTimeout(afterUnmount, delay);
        } else {
            afterUnmount(false);
        }
    }

    if (!unmounting.current.size) { // maybe do this simultanously with unmount (requires unmounts to happen with position absolute..)
        mounting.current.forEach(({ child, index }, key) => {
            rendered.current.splice(index, 0, { child, key });
        });
        mounting.current.clear();
    }

    useMountEffect(() => {
        if (!ref.current) return;

        for (const child of ref.current.children) {
            if (!child.current?.id ||
                !child.current.timeline.mounted ||
                !child.current.adaptive ||
                !rendered.current.some(({ key }) => key === (child.current as any).id)) continue;

            child.current.timeline.transition(undefined, transition);
        }
    });

    return <Animatable ref={ref} passthrough cachable={[]}>
        {rendered.current.map(({ child }) => child)}
    </Animatable>;
}