'use client';

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from "react";
import Animator, { AnimationOptions, AnimationTrigger } from "./core/animator";
import Clip, { ClipInitials, ClipKey, ClipOptions } from "./core/clip";
import { forEachTrigger, getLifeCycleAnimations, mergeRefs, serializeTriggers, getInitialStyleFromLinks, mergeStyles } from "./core/utils";
import { CacheKey } from "./core/track";
import { LayoutGroupContext } from "./layout-group";
import { deleteMorphTarget, getMorphTarget, registerAsMorph, registerToLayoutGroup, unregisterFromLayoutGroup } from "./core/state";
import { TransitionOptions } from "./core/animation-link";

export type AnimateTriggers<T extends string> = {
    [key in T]?: AnimationTrigger[] | ({ on: AnimationTrigger[] } & AnimationOptions);
};

export type AnimateProps<T extends string> = {
    ref?: React.Ref<Animator<T | 'animate'>>;
    children: React.ReactNode;
    inherit?: boolean | number;
    initial?: ClipInitials;
    animate?: ClipOptions | Clip;
    clips?: {
        [key in T]: ClipOptions | Clip;
    };
    triggers?: AnimateTriggers<T | 'animate'>;
    stagger?: number;
    staggerLimit?: number;
    ignoreScaleDeformation?: boolean;
    cache?: CacheKey[];
    transition?: TransitionOptions;
    morph?: string;
    paused?: boolean;
    onAnimationEnd?: (animation?: T) => void;
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
    transition,
    morph,
    clips,
    paused = false,
    onAnimationEnd
}: AnimateProps<T>) {
    const id = '_la' + useId();
    const parentId = use(AnimateContext);
    const layoutId = use(LayoutGroupContext);
    (triggers as any)._livelyId = id; // on re-render doesn't get assigned in time for parent to read..

    const previousTriggers = useRef(serializeTriggers(triggers));
    const data = useRef<Animator<any>>(null);
    if (!data.current) {
        const animations: {
            [key in T | 'animate']: Clip;
        } = {
            animate: animate instanceof Clip ? animate : new Clip(animate, initial)
        } as any;

        for (const name in clips) animations[name] = clips[name] instanceof Clip ? clips[name] : new Clip(clips[name], initial);

        const animator = data.current = new Animator({
            id,
            clips: animations,
            lifeCycleAnimations: getLifeCycleAnimations(triggers),
            ignoreScaleDeformation,
            cache,
            stagger,
            staggerLimit
        });

        animator.register(parentId, inherit);
        animator.addLinks(animate);
    }
    const { current: animator } = data;

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        animator.register(parentId, inherit);
        animator.addLinks(animate);

        if (morph) { // <- clean up code
            const target = getMorphTarget(morph);
            registerAsMorph(morph, id);

            if (target) {
                animator.transition(target, transition); // if this happens should prevent transition in layoutgroup? (or cache update prevents already?)
                deleteMorphTarget(morph, target.id);
                animator.state = 'mounted';
            }
        }

        const skipMount = registerToLayoutGroup(layoutId, id);
        if (skipMount) animator.state = 'mounted';

        document.fonts.ready.finally(() => animator.mount());

        const updateAnimatorCache = () => animator.forEachTrack(track => track.snapshot());
        window.addEventListener('resize', updateAnimatorCache);

        return () => {
            unregisterFromLayoutGroup(layoutId, id);
            animator.dispose();

            window.removeEventListener('resize', updateAnimatorCache);
        }
    }, []);

    useEffect(() => {
        const serialized = serializeTriggers(triggers);

        forEachTrigger(triggers, (animation, _, options) => {
            if (serialized[animation] !== previousTriggers.current[animation]) animator.play(animation as any, options);
            // also should only play when boolean === true?
        });

        previousTriggers.current = serialized;
    }, [triggers]);

    useEffect(() => {
        if (animate instanceof Clip || animator.state !== 'mounted') return;

        for (const key in animate) {
            const value = animate[key as ClipKey];

            if (key in animator.links && typeof value !== 'object') {
                animator.links[key as ClipKey]!.set(value, {
                    duration: animate.duration, // or use transition prop?
                    easing: animate.easing
                });
            }
        }
    }, [animate]);

    useEffect(() => {
        if (onAnimationEnd) animator.on('animationend', onAnimationEnd);

        return () => {
            if (onAnimationEnd) animator.off('animationend', onAnimationEnd);
        }
    }, [onAnimationEnd]);

    useEffect(() => animator.setPlayState(paused), [paused]);

    return <AnimateContext value={id}>
        {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            let { ref, style } = (child as React.ReactElement<React.HTMLProps<any>>).props;

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: mergeRefs(
                    ref || null,
                    el => animator.addTrack(el, i)
                ),
                style: mergeStyles(
                    style,
                    animator.mergeInitialStyles(initial),
                    getInitialStyleFromLinks(animator.links, i)
                ),
                ['data-lively' as any]: true
            });
        })}
    </AnimateContext>;
}