import { Children, isValidElement, useEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import { Easing } from "../core/clip";

function snapshot(children: React.ReactNode, map: { [key: string]: boolean } = {}) {
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        if ((child.type as any)?.displayName === 'Animatable' && 'id' in child.props) {
            map[child.props.id] = true;
        }

        snapshot(child.props.children, map);
    });

    return map;
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
        if (!ref.current) return;

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