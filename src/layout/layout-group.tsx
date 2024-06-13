'use client';

import { Children, isValidElement, useEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import { Easing } from "../core/clip";
import useMountEffect from "../hooks/use-mount-effect";
import type { TransitionOptions } from "../core/track";

function snapshot(children: React.ReactNode, map: { [key: string]: boolean } = {}) {
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        if ((child.type as any)?.isLively && 'id' in (child as React.ReactElement<any>).props) {
            map[(child as React.ReactElement<any>).props.id] = true;
        }

        snapshot((child as React.ReactElement<any>).props.children, map);
    });

    return map;
}

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

function isEqual(a: any, b: any) {
    try {
        return compare(a, b);
    } catch (err) {
        return false;
    }
}

// TODO: use snapshots to detect which elements mounted/unmounted and use this info to merge different versions of actual.current, then use that to update rendered content
// simultanous unmount / mount?

export default function LayoutGroup({
    children,
    transition
}: {
    children: React.ReactNode;
    transition?: { duration?: number; easing?: Easing; };
}) {
    const ref = useRef<AnimatableType | null>(null);
    const cache = useRef(snapshot(children));
    const [content, setContent] = useState(children);

    useEffect(() => {
        if (!ref.current || isEqual(content, children)) return;

        let delay = 0, pending = snapshot(children);
        for (const child of ref.current.children) {
            if (child.current && !child.current.manual && child.current.id in cache.current && !(child.current.id in pending)) {
                delay = Math.max(child.current.trigger('unmount'), delay);
            }
        }

        cache.current = pending;
        setTimeout(() => setContent(children), delay * 1000);
    }, [children]);

    useMountEffect(() => {
        if (!ref.current) return;

        for (const child of ref.current.children) {
            if (child.current?.timeline.mounted && child.current.adaptive) {
                child.current.timeline.transition(undefined, transition);
            }
        }
    }, [content]);

    return <Animatable ref={ref} cachable={[]} passthrough>
        {content}
    </Animatable>
}

export function ExpLayoutGroup({ children, transition }: {
    children: React.ReactNode;
    transition?: Omit<TransitionOptions, 'reverse'>;
}) {
    const candidates = Children.toArray(children).filter(child => isValidElement(child)) as React.ReactElement<any>[];
    const ref = useRef<AnimatableType | null>(null);
    const [_, forceUpdate] = useState({});

    const awaiting = new Set<string>();
    const rendered = useRef<React.ReactElement<any>[]>([]);
    const mounting = useRef(new Map<string, {
        child: React.ReactElement<any>;
        index: number;
    }>());

    const timeout = useRef<any>(undefined);
    const unmountDelay = useRef(0);
    const unmounting = useRef<Set<string>>(new Set());

    for (let i = 0; i < candidates.length; i++) {
        const child = candidates[i];

        if (!(child.type as any).isLively || !('id' in child.props)) continue; // non-lively components should also be rendered

        const index = rendered.current.findIndex(rendered => rendered.props.id === child.props.id);
        if (index < 0) {
            mounting.current.set(child.props.id, { child, index: i });
        } else {
            rendered.current[index] = child;
        }

        awaiting.add(child.props.id);
    }

    mounting.current.forEach((_, key) => {
        if (!awaiting.has(key)) mounting.current.delete(key);
    });

    for (const child of rendered.current) {
        if (!awaiting.has(child.props.id)) unmounting.current.add(child.props.id);
    }

    if (unmounting.current.size && ref.current) { // cancel unmount if component remounts again

        for (const child of ref.current.children) {
            if (child.current && unmounting.current.has(child.current.id) && child.current.timeline.mounted) {
                const ends = Date.now() + child.current.trigger('unmount') * 1000;
                unmountDelay.current = Math.max(unmountDelay.current, ends);

                child.current.timeline.mounted = false;
            }
        }

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            unmounting.current.forEach(key => {
                const i = rendered.current.findIndex(child => child.props.id === key);
                rendered.current.splice(i, 1);
            });
            unmounting.current.clear();
            forceUpdate({});
        }, unmountDelay.current - Date.now());
    }

    if (!unmounting.current.size) { // maybe do this simultanously with unmount (requires unmounts to happen with position absolute..)
        mounting.current.forEach(({ child, index }) => {
            rendered.current.splice(index, 0, child);
        });
        mounting.current.clear();
    }

    useMountEffect(() => {
        if (!ref.current) return;

        for (const child of ref.current.children) { // still produced some unwanted opacity flashes when child is still mounting
            if (!child.current?.id ||
                !child.current.timeline.mounted ||
                !child.current.adaptive ||
                !rendered.current.some(rendered => rendered.props.id === (child.current as any).id)) continue;

            child.current.timeline.transition(undefined, transition);
        }
    });

    return <Animatable ref={ref} passthrough cachable={[]}>
        {rendered.current}
    </Animatable>;
}