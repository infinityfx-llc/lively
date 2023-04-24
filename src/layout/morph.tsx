import { Children, cloneElement, forwardRef, isValidElement, useEffect, useId, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import { AnimatableKey, Easing } from "../core/clip";
import { combineRefs } from "../core/utils";

const Morphs: { [key: string]: { [key: string]: AnimatableType | null } } = {};

const Morph = forwardRef(({ children, shown, id, include, transition = {} }: { children: React.ReactNode; shown: boolean; id: string; include?: AnimatableKey[]; transition?: { duration?: number; easing?: Easing } }, forwardedRef: React.ForwardedRef<AnimatableType>) => {
    const ref = useRef<AnimatableType | null>(null);
    const uuid = useId();
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!ref.current || !ref.current.mounted) return;

        let prev;
        for (const key in Morphs[id]) {
            if (key === uuid) continue;

            if (prev = Morphs[id][key]) break;
        }

        if (prev && shown) ref.current.timeline.transition(prev.timeline, transition);

        setUpdated(!updated);
    }, [shown]);

    useEffect(() => {
        if (!(id in Morphs)) Morphs[id] = {};
        Morphs[id][uuid] = shown ? ref.current : null;

        return () => {
            Morphs[id][uuid] = null;
        };
    }, [updated]);

    if (Children.count(children) > 1 || !isValidElement(children)) return <>{children}</>;

    return <Animatable cachable={include} id={id} ref={combineRefs(ref, forwardedRef)}>
        {cloneElement(children, { style: { ...children.props.style, opacity: shown ? 1 : 0 } } as any)}
    </Animatable>;
});
Morph.displayName = 'Morph';

export default Morph;