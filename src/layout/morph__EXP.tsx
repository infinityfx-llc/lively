import { forwardRef, useContext, useEffect, useId, useRef } from "react";
import Animatable, { AnimatableContext, AnimatableType } from "../animatable__EXP";
import { Easing } from "../core/clip";
import { combineRefs } from "../core/utils";
import { AnimatableProps } from "../animatable";

const Morphs: {
    [key: string]: {
        [key: string]: {
            animatable: AnimatableType | null;
            mounted: boolean;
        }
    };
} = {};

type MorphProps = {
    id: string;
    transition?: { duration?: number; easing?: Easing };
} & AnimatableProps;

// - crossfades
// - if no morph target, do opacity transition

const Morph = forwardRef<AnimatableType, MorphProps>(({
    children,
    id,
    transition = {},
    ...props
}, ref) => {
    const parent = useContext(AnimatableContext);
    const self = useRef<AnimatableType | null>(null);
    // const isMount = useRef(true);
    const uuid = useId();

    id = parent ? parent.id + id : id;

    useEffect(() => {
        if (!self.current) return;

        for (const key in Morphs[id]) {
            if (key === uuid) continue;

            const morph = Morphs[id][key];
            if (morph.animatable && !morph.mounted) {
                self.current.timeline.transition(morph.animatable.timeline, transition);
                Morphs[id][key].animatable = null;
                // isMount.current = false;

                break;
            }
        }

        // if (isMount.current) {
        //     self.current.timeline.add(new Clip({ opacity: [0, 1], ...transition }), { commit: false });
        // }

        return () => {
            Morphs[id][uuid].mounted = false;
        }
    }, []);

    return <Animatable {...props} id={id} ref={combineRefs(el => {
        self.current = el;

        if (!(id in Morphs)) Morphs[id] = {};
        if (el) Morphs[id][uuid] = { animatable: el, mounted: true };
    }, ref)}>
        {children}
    </Animatable>;
});

Morph.displayName = 'Morph';

export default Morph;