import { Children, cloneElement, forwardRef, isValidElement, useEffect, useId, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import Clip, { AnimatableKey, Easing } from "../core/clip";
import { combineRefs } from "../core/utils";

const Morphs: { [key: string]: { [key: string]: AnimatableType | null } } = {};

type MorphProps = {
    children: React.ReactNode;
    id: string;
    shown: boolean;
    include?: AnimatableKey[];
    transition?: { duration?: number; easing?: Easing };
    deform?: boolean;
    disabled?: boolean;
    paused?: boolean;
};

const Morph = forwardRef(({ children, shown, id, include, transition = {}, ...props }: MorphProps, forwardedRef: React.ForwardedRef<AnimatableType>) => {
    const ref = useRef<AnimatableType | null>(null);
    const uuid = useId();
    const [updated, setUpdated] = useState<{ hidden: boolean; }>({ hidden: false });

    useEffect(() => {
        if (!ref.current || !ref.current.mounted) return;

        let prev;
        for (const key in Morphs[id]) {
            if (key === uuid) continue;

            if (prev = Morphs[id][key]) break;
        }

        if (prev && shown) {
            ref.current.timeline.transition(prev.timeline, transition);
        } else
            if (shown) {
                ref.current.timeline.add(new Clip({ opacity: [0, 1], ...transition }), { commit: false });
            }

        (Morphs[id].__shown as any) = Morphs[id].__shown || shown;

        setUpdated({ hidden: !!Morphs[id][uuid] && !shown });
    }, [shown]);

    useEffect(() => {
        if (!(id in Morphs)) Morphs[id] = {};

        if (updated.hidden && (Morphs[id].__shown as any) === false) {
            ref.current?.timeline.add(new Clip({ opacity: [1, 0], visibility: ['visible', 'hidden'], ...transition }), { commit: false });
        }

        if (Morphs[id].__shown) Morphs[id].__shown = null;
        Morphs[id][uuid] = shown ? ref.current : null;

        return () => {
            Morphs[id][uuid] = null;
        };
    }, [updated]);

    if (Children.count(children) > 1 || !isValidElement(children)) return <>{children}</>;

    return <Animatable {...props} cachable={include} id={id} ref={combineRefs(ref, forwardedRef)}>
        {cloneElement(children, { style: { ...children.props.style, visibility: shown ? 'visible' : 'hidden' } } as any)}
    </Animatable>;
});

Morph.displayName = 'Morph';

export default Morph;