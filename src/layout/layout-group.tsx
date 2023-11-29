import { Children, isValidElement, useEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import { Easing } from "../core/clip";

function snapshot(children: React.ReactNode, map: { [key: string]: boolean } = {}) {
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        const displayName = (child.type as any)?.displayName;
        if ((displayName === 'Animatable' || displayName === 'Animate') && 'id' in child.props) {
            map[child.props.id] = true;
        }

        snapshot(child.props.children, map);
    });

    return map;
}

function compare(a: any, b: any) {
    const typeA = typeof a,
        typeB = typeof b;
    if (typeA !== typeB) return false;

    if (isValidElement(a)) {
        if (!isValidElement(b) || a.key !== b.key) return false;

        return compare(a.props, b.props);
    }

    if (typeA === 'function' && typeB === 'function') return true;

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

        for (let i = 0; i < keysA.length; i++) {
            if (!(keysA[i] in b) || !compare(a[keysA[i]], b[keysB[i]])) return false;
        }

        return true;
    }

    return a === b;
}

function isEqual(a: any, b: any) {
    try {
        return compare(a, b);
    } catch (err) {
        return false;
    }
}

// simultanous unmount / mount

export default function LayoutGroup({
    children,
    transition
}: {
    children: React.ReactNode;
    transition?: { duration?: number; easing?: Easing };
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

    useEffect(() => {
        if (!ref.current) return;

        for (const child of ref.current.children) {
            if (child.current?.timeline.mounted && child.current.adaptive) {
                child.current.timeline.transition(undefined, transition);
            }
        }
    }, [content]);

    return <Animatable ref={ref} cachable={[]}>
        {content}
    </Animatable>
}