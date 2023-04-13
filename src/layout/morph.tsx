'use client';

import { Children, cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import { Easing } from "../core/clip";

const Morphs: { [key: string]: { [key: string]: AnimatableType | null } } = {};

export default function Morph({ children, shown, id, transition = {} }: { children: React.ReactNode; shown: boolean; id: string; transition?: { duration?: number; easing?: Easing } }) {
    const ref = useRef<AnimatableType | null>(null);
    const uuid = useId();
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!ref.current || !shown) return;

        let prev;
        for (const key in Morphs[id]) {
            if (key === uuid) continue;

            if (prev = Morphs[id][key]) break;
        }

        if (!prev) return;

        ref.current.timeline.transition(prev.timeline, transition);

        setUpdated(!updated);
    }, [shown]);

    useEffect(() => {
        Morphs[id][uuid] = shown ? ref.current : null;
    }, [updated]);

    if (!Children.only(children) || !isValidElement(children)) return <>{children}</>;

    return <Animatable id={id} ref={el => {
        ref.current = el;
        if (!(id in Morphs)) Morphs[id] = {};
        if (!(uuid in Morphs[id])) Morphs[id][uuid] = shown ? el : null;
    }}>
        {cloneElement(children, { style: { ...children.props.style, opacity: shown ? 1 : 0 } } as any)}
    </Animatable>;
}