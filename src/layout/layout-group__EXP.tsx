import { useEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable__EXP";
import { Easing } from "../core/clip";

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

        let delay = 0;
        for (const child of ref.current.children) {
            if (!child.current) continue;

            if (!child.current.timeline.mounted && child.current.unmount) { // TODO figure if somehting has unmounted
                const animation = typeof child.current.unmount === 'string' ? child.current.unmount : 'animate';

                delay = Math.max(
                    child.current.play(animation, { immediate: true, reverse: animation === 'animate' }),
                    delay
                );
            }
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