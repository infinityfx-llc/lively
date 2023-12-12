import { forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Animatable, { AnimatableContext, AnimatableType, AnimatableProps } from "../animatable";
import { combineRefs } from "../core/utils";
import Timeline from "../core/timeline";
import { TransitionOptions } from "../core/track";

// - crossfades (difficult, because easing is not symmetric in reverse)

const Groups: {
    [key: string]: {
        targets: Set<Timeline>;
        visible: boolean;
    }
} = {};

type MorphProps = {
    group: string;
    transition?: Omit<TransitionOptions, 'reverse'>;
    show?: boolean;
} & AnimatableProps;

const Morph = forwardRef<AnimatableType, MorphProps>(({
    children,
    transition = {}, // should be able to be inherited
    show = true,
    group,
    ...props
}, ref) => {
    const parent = useContext(AnimatableContext);
    const self = useRef<AnimatableType | null>(null);

    const [prev, setPrev] = useState(show);
    const [state, setState] = useState(show);

    group = parent?.group ? `${parent.group}__${group}` : group;

    useEffect(() => {
        if (!self.current) return;
        const timeline = self.current.timeline;

        let morphTarget;
        Groups[group].targets.forEach(target => {
            if (target.mounted && target !== timeline) morphTarget = target;
        });

        if (show && !timeline.mounted) {
            Groups[group].visible = true;

            if (morphTarget) {
                timeline.transition(morphTarget, transition);
            } else {
                self.current.trigger('mount');
            }
        }

        setState(show);
    }, [show]);

    useLayoutEffect(() => {
        if (!self.current) return;
        const timeline = self.current.timeline;

        if (!show && timeline.mounted) {
            if (!Groups[group].visible) {
                const dt = self.current?.trigger('unmount');
                setTimeout(() => setPrev(false), dt * 1000);
            }

            Groups[group].targets.delete(timeline);
        }
        if (show || Groups[group].visible) setPrev(show);

        setTimeout(() => Groups[group].visible = false);
        timeline.mounted = show;
    }, [state]);

    // useEffect(() => {
    //     if (!self.current) return;
    //     const timeline = self.current.timeline;

    //     for (let i = 0; i < Groups[group].length; i++) {
    //         const target = Groups[group][i];
    //         if (!target || target.mounted || target === self.current.timeline || timeline.test) continue;
    //         timeline.test = true;

    //         timeline.transition(target, transition);
    //         Groups[group].splice(i, 1);
    //         break;
    //     }

    //     return () => {
    //         timeline.mounted = false;
    //         // timeline.tracks.values.forEach(track => track.finish()); // mabye do this in animatable? (then also dont need to care about mount using immediate!)
    //     }
    // }, []);

    if (!show && prev === show) return null;

    return <Animatable {...props} manual group={group} ref={combineRefs(el => {
        // self.current = el;
        // if (el && !el.timeline.mounted) el.timeline.rendered = show;

        if (!(group in Groups)) Groups[group] = { targets: new Set(), visible: false };
        if (el) {
            Groups[group].targets.add(el.timeline);
            self.current = el;
        }
    }, ref)}>
        {children}
    </Animatable >;
});

Morph.displayName = 'Morph';

export default Morph;