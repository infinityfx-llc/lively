import { cloneElement, forwardRef, useContext, useEffect, useRef, useState } from "react";
import Animatable, { AnimatableContext, AnimatableType, AnimatableProps } from "../animatable";
import { combineRefs } from "../core/utils";
import Timeline from "../core/timeline";
import { TransitionOptions } from "../core/track";

// - crossfades (difficult, because easing is not symmetric in reverse)
// - dont use visibility prop but actually unmount stuff (delay this for unmount animation)

const Groups: {
    [key: string]: {
        targets: Set<Timeline>;
        visible: boolean;
    }
} = {};

type MorphProps = {
    children: React.ReactElement;
    group: string;
    transition?: Omit<TransitionOptions, 'reverse'>;
    show?: boolean;
} & Omit<AnimatableProps, 'children'>;

const Morph = forwardRef<AnimatableType, MorphProps>(({
    children,
    transition = {}, // should be able to be inherited
    show = true,
    group,
    ...props
}, ref) => {
    const parent = useContext(AnimatableContext);
    const self = useRef<AnimatableType | null>(null);
    const [rendered, setRendered] = useState(show);

    group = parent?.group ? `${parent.group}__${group}` : group;

    useEffect(() => {
        if (!self.current) return;
        const timeline = self.current.timeline;

        let target;
        Groups[group].targets.forEach(timeline => {
            if (timeline.rendered) target = timeline;
        });

        if (show && !timeline.rendered) {
            Groups[group].visible = true;

            if (target) {
                timeline.transition(target, transition);
            } else {
                self.current.trigger('mount', { commit: false });
            }
        }

        setRendered(show);
    }, [show]);

    useEffect(() => {
        if (!self.current) return;
        const timeline = self.current.timeline;

        if (!show && timeline.rendered && !Groups[group].visible) {
            self.current?.trigger('unmount', { commit: false });
        }

        setTimeout(() => Groups[group].visible = false);
        timeline.rendered = show;
    }, [rendered]);

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

    return <Animatable {...props} manual group={group} ref={combineRefs(el => {
        self.current = el;
        if (el && !el.timeline.mounted) el.timeline.rendered = show;

        if (!(group in Groups)) Groups[group] = { targets: new Set(), visible: false };
        if (el) Groups[group].targets.add(el.timeline);
    }, ref)}>
        {cloneElement(children, { style: { ...children.props.style, visibility: show ? undefined : 'hidden' } } as any)}
    </Animatable >;
});

Morph.displayName = 'Morph';

export default Morph;