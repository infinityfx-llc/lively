'use client';

import { Children, isValidElement, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import useMountEffect from "../hooks/use-mount-effect";
import type { TransitionOptions } from "../core/track";

function compare(a: any, b: any): boolean {
    const typeA = typeof a,
        typeB = typeof b;
    if (typeA !== typeB) return false;

    if (isValidElement(a)) {
        if (!isValidElement(b) || a.key !== b.key) return false;

        return compare(a.props, b.props);
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (!compare(a[i], b[i])) return false;
        }

        return true;
    }

    if (typeA === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a),
            keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;
        if (!keysA.length) return a.toString() === b.toString();

        for (let i = 0; i < keysA.length; i++) {
            if (!(keysA[i] in b) || !compare(a[keysA[i]], b[keysB[i]])) return false;
        }

        return true;
    }

    return (typeA === 'function' && typeA === typeB) || a === b;
}

function isEqual(a: any, b: any) { // was used to avoid unnecessary adaptive transitions (but is not ideal fix)
    try {
        return compare(a, b);
    } catch (err) {
        return false;
    }
}

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
            if (!child.current) continue;

            const isUnmounting = unmounting.current.has(child.current.id);

            if (isUnmounting && awaiting.has(child.current.id)) {
                child.current.timeline.mounted = true;

                unmounting.current.delete(child.current.id);
            }

            if (isUnmounting && child.current.timeline.mounted) { // look into detecing morphs (dont umount when morph transition)
                const ends = Date.now() + child.current.trigger('unmount', { immediate: true }) * 1000;
                unmountDelay.current = Math.max(unmountDelay.current, ends);

                child.current.timeline.mounted = false;
            }
        }

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            unmounting.current.forEach(key => {
                const i = rendered.current.findIndex(({ key: childKey }) => childKey === key);
                rendered.current.splice(i, 1);
            });
            unmounting.current.clear();
            forceUpdate({});
        }, unmountDelay.current - Date.now());
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
            if (!child.current?.id || // take into account manual as well?
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