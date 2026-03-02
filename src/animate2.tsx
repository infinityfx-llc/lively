// - notes:
// - with global state construct virtual element tree that can be used for unmounting logic
// - consider what props to cascade; (clips, stagger, etc.)

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef } from "react";
import Animator, { AnimationTrigger } from "./core/animator";
import Clip, { ClipInitials, ClipOptions } from "./core/clip2";
import { getLifeCycleAnimations, serializeTriggers } from "./core/utils2";

type AnimateProps<T extends string> = {
    ref?: React.Ref<Animator<T | 'animate'>>;
    children: React.ReactNode;
    inherit?: boolean | number;
    initial?: ClipInitials;
    animate?: ClipOptions | Clip;
    clips?: {
        [key in T]: ClipOptions | Clip;
    };
    triggers?: {
        [key in T | 'animate']?: AnimationTrigger[];
    };
    stagger?: number;
    staggerLimit?: number;
    ignoreScaleDeformation?: boolean;
    paused?: boolean;
    onAnimationEnd?: (animation: T) => void;
};

export const AnimateContext = createContext<string>('');

export default function Animate<T extends string>(this: any, {
    ref,
    children,
    inherit = false,
    initial = {},
    animate = {},
    triggers = {
        animate: ['mount']
    },
    stagger,
    staggerLimit,
    clips,
    paused = false,
    onAnimationEnd
}: AnimateProps<T>) {
    const id = useId();
    const parentId = use(AnimateContext);

    this.livelyId = id; // test if this can be read from a LayoutGroup

    const previousTriggers = useRef(serializeTriggers(triggers));
    const animator = useMemo(() => {
        const animations: {
            [key in T | 'animate']: Clip;
        } = {
            animate: animate instanceof Clip ? animate : new Clip(animate, initial)
        } as any;

        for (const name in clips) animations[name] = clips[name] instanceof Clip ? clips[name] : new Clip(clips[name], initial);

        return new Animator({ id, parentId, inherit, clips: animations, lifeCycleAnimations: getLifeCycleAnimations(triggers), stagger, staggerLimit });
    }, []);

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        document.fonts.ready.finally(animator.mount);

        return () => animator.dispose();
    }, []);

    useEffect(() => {
        const serialized = serializeTriggers(triggers);

        for (const animation in triggers) {

            if (serialized[animation] !== previousTriggers.current[animation]) animator.play(animation as any);
            // ^ allow for AnimationOptions?
            // also should only play when boolean === true?
        }

        previousTriggers.current = serialized;
    }, [triggers]);

    useEffect(() => {
        if (onAnimationEnd) animator.on('end', onAnimationEnd);

        return () => {
            if (onAnimationEnd) animator.off('end', onAnimationEnd);
        }
    }, [onAnimationEnd]);

    useEffect(() => {
        animator.pause(); // todo
    }, [paused]);

    return <AnimateContext value={id}>
        {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: (el: any) => animator.addTrack(el, i),
                style: animator.mergeInitialStyles(initial)
            });
        })}
    </AnimateContext>;
}