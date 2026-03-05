// - notes:
// - consider what props to cascade; (clips, triggers, stagger, paused, cache?)
'use client';

import { Children, cloneElement, createContext, Fragment, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef } from "react";
import Animator, { AnimationTrigger } from "./core/animator";
import Clip, { ClipInitials, ClipOptions } from "./core/clip2";
import { getLifeCycleAnimations, mergeRefs, serializeTriggers } from "./core/utils2";
import { CacheKey } from "./core/track2";
import { LayoutGroupContext } from "./layout-group";
import { getAnimator, registerToLayoutGroup, unregisterFromLayoutGroup } from "./core/state";

export type AnimateProps<T extends string> = {
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
    cache?: CacheKey[];
    paused?: boolean;
    onAnimationEnd?: (animation: T) => void;
};

export const AnimateContext = createContext<string>('');

export default function Animate<T extends string>({
    ref,
    children,
    inherit = false,
    initial = {},
    animate = {},
    triggers = {
        animate: ['mount']
    },
    stagger = 0.07,
    staggerLimit = 10,
    ignoreScaleDeformation = false,
    cache = ['x', 'y', 'sx', 'sy', 'rotate', 'borderRadius'],
    clips,
    paused = false,
    onAnimationEnd
}: AnimateProps<T>) {
    const id = '_la' + useId();
    const parentId = use(AnimateContext);
    const layoutId = use(LayoutGroupContext);
    (triggers as any)._livelyId = id; // better typing?

    const previousTriggers = useRef(serializeTriggers(triggers));
    const animator = useMemo(() => {
        const animator = getAnimator(id); // clean up this code
        if (animator) return animator;

        const animations: {
            [key in T | 'animate']: Clip;
        } = {
            animate: animate instanceof Clip ? animate : new Clip(animate, initial)
        } as any;

        for (const name in clips) animations[name] = clips[name] instanceof Clip ? clips[name] : new Clip(clips[name], initial);

        return new Animator({
            id,
            parentId,
            inherit,
            clips: animations,
            lifeCycleAnimations: getLifeCycleAnimations(triggers),
            ignoreScaleDeformation,
            cache,
            stagger,
            staggerLimit
        });
    }, []);

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        const skipMount = registerToLayoutGroup(layoutId, id);
        if (skipMount) animator.state = 'mounted';
        // ^ after unmount, remounting doesn't correctly add id to LayoutGroup? (2nd unmount doesn't work)

        document.fonts.ready.finally(() => animator.mount());

        return () => {
            unregisterFromLayoutGroup(layoutId, id);

            animator.dispose();
        }
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
        if (onAnimationEnd) animator.on('animationend', onAnimationEnd);

        return () => {
            if (onAnimationEnd) animator.off('animationend', onAnimationEnd);
        }
    }, [onAnimationEnd]);

    useEffect(() => animator.togglePlayState(paused), [paused]);

    return <AnimateContext value={id}>
        {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            let { ref, style } = (child as React.ReactElement<React.HTMLProps<any>>).props;
            style = Object.assign({}, style);

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: mergeRefs(
                    ref || null,
                    el => animator.addTrack(el, i)
                ),
                style: Object.assign(style, animator.mergeInitialStyles(initial))
            });
        })}
    </AnimateContext>;
}