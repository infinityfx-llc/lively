import { forwardRef, useContext, useEffect, useRef } from "react";
import Animatable, { AnimatableContext, AnimatableType, AnimatableProps } from "../animatable";
import { Easing } from "../core/clip";
import { combineRefs } from "../core/utils";
import Timeline from "../core/timeline";

// - crossfades
// - unmount animation when no morph target

const Groups: {
    [key: string]: Timeline[];
} = {};

type MorphProps = {
    group: string;
    transition?: { duration?: number; easing?: Easing };
} & AnimatableProps;

const Morph = forwardRef<AnimatableType, MorphProps>(({
    children,
    transition = {},
    group,
    ...props
}, ref) => {
    const parent = useContext(AnimatableContext);
    const self = useRef<AnimatableType | null>(null);

    group = parent ? parent.group + group : group;

    useEffect(() => {
        if (!self.current) return;
        const timeline = self.current.timeline;

        for (let i = 0; i < Groups[group].length; i++) {
            const target = Groups[group][i];
            if (!target || target.mounted || target === self.current.timeline) continue;

            timeline.transition(target, transition);
            timeline.test = true;
            Groups[group].splice(i, 1);
            break;
        }

        return () => {
            timeline.mounted = false;
            // setTimeout(() => { // DOESNT WORK
            //     if (group) {
            //         const i = Groups[group].indexOf(timeline);
            //         if (i >= 0) Groups[group].splice(i, 1);
            //     }
            // });
        }
    }, []);

    return <Animatable {...props} group={group} ref={combineRefs(el => {
        self.current = el;

        if (!(group in Groups)) Groups[group] = [];
        if (el && !Groups[group].includes(el.timeline)) Groups[group].push(el.timeline);
    }, ref)}>
        {children}
    </Animatable >;
});

Morph.displayName = 'Morph';

export default Morph;