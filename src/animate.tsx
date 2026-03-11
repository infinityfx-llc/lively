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
    const id = (triggers as any)._livelyId ?? '_la' + useId();
    const parentId = use(AnimateContext);
    const layoutId = use(LayoutGroupContext);

    const timeout = useRef(0);
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
            clearTimeout(timeout.current);
            registerAsMorph(morph, animator);
            const target = getMorphTarget(morph, id);

            if (target) {
                animator.transition(target, transition);
                deleteMorphTarget(morph, target);
                animator.state = 'mounted';
            }
        }

        const skipMount = registerToLayoutGroup(layoutId, id);
        if (skipMount) animator.state = 'mounted';

        document.fonts.ready.finally(() => animator.mount());

        const updateAnimatorCache = () => animator.forEachTrack(track => track.snapshot());
        window.addEventListener('resize', updateAnimatorCache);

        return () => {
            animator.dispose();
            unregisterFromLayoutGroup(layoutId, id);
            if (morph) timeout.current = deleteMorphTarget(morph, animator, 1);

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
            if (!(key in animator) || typeof value === 'object') continue;

            animator.links[key as ClipKey]!.set(value, transition);
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