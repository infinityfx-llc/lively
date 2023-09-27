import { useEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable__EXP";
import { Easing } from "../core/clip";

function snapshot(children: any, map: { [key: string]: boolean } = {}) {
    for (const child of (Array.isArray(children) ? children : [children])) {
        if (child._owner) snapshot((child as any)._owner, map);
        if (child.sibling) snapshot(child.sibling, map);
        if (child.child) snapshot(child.child, map);

        if (child.type?.displayName === 'Animatable' && child.ref?.current) {
            map[child.ref.current.id] = true;
        }
    }

    return map;
}

export default function LayoutGroup({
    children,
    adaptive = true,
    transition = {}
}: {
    children: React.ReactNode;
    adaptive?: boolean;
    transition?: {
        duration?: number;
        easing?: Easing;
    };
}) {
    const ref = useRef<AnimatableType | null>(null);
    const [content, setContent] = useState(children);

    useEffect(() => {
        if (!ref.current) return;

        let delay = 0, map = snapshot(children);
        for (const child of ref.current.children) {
            if (!child.current || !child.current.unmount || child.current.id in map) continue;

            const animation = typeof child.current.unmount === 'string' ? child.current.unmount : 'animate';

            delay = Math.max(
                child.current.play(animation, { immediate: true, reverse: animation === 'animate' }),
                delay
            );
        }

        setTimeout(() => setContent(children), delay * 1000);
    }, [children]);

    useEffect(() => {
        if (!ref.current || !adaptive) return;

        for (const child of ref.current.children) {
            if (!child.current?.timeline.mounted) continue;

            child.current.timeline.transition(undefined, transition);
        }
    }, [content]);

    return <Animatable ref={ref}>
        {content}
    </Animatable>
}