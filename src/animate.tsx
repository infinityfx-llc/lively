'use client';

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import Animator, { AnimationOptions, AnimationTrigger } from "./core/animator";
import Clip, { ClipInitials, ClipKey, ClipOptions } from "./core/clip";
import { forEachTrigger, getLifeCycleAnimations, mergeRefs, serializeTriggers, getInitialStyleFromLinks, mergeStyles } from "./core/utils";
import { CacheKey, CorrectionAlignment } from "./core/track";
import { LayoutGroupContext } from "./layout-group";
import { deleteMorphTarget, getMorphTarget, registerToLayoutGroup, unregisterFromLayoutGroup } from "./core/state";
import { TransitionOptions } from "./core/animation-link";

export type AnimateTriggers<T extends string> = {
    [key in T]?: (AnimationTrigger | { on: AnimationTrigger } & AnimationOptions)[];
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
    deformCorrection?: CorrectionAlignment | boolean; // allow for partial (no children)
    transition?: TransitionOptions & {
        cache?: CacheKey[];
    };
    lite?: boolean;
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
    deformCorrection,
    transition,
    lite,
    morph,
    clips,
    paused = false,
    onAnimationEnd
}: AnimateProps<T>) {
    const id = (triggers as any)._livelyId ?? '_la' + useId();
    const parentId = use(AnimateContext);
    const layoutId = use(LayoutGroupContext);

    const mounted = useRef(0);
    const morphTarget = useRef<Animator<any>>(null);

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
            deformCorrection: lite ? false : deformCorrection,
            transition: lite ? { cache: [] } : transition,
            stagger,
            staggerLimit
        });

        animator.register(parentId, inherit, morph);
        animator.addLinks(animate);
    }
    const { current: animator } = data;
    const [skipMount, setSkipMount] = useState(registerToLayoutGroup(layoutId, animator.id));

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        mounted.current = Date.now();
        animator.register(parentId, inherit, morph);
        animator.addLinks(animate);

        if (morph) { // fluid nav.group has weird jitter bug
            const target = morphTarget.current || getMorphTarget(morph, animator.id);
            morphTarget.current = target;

            if (target) {
                animator.isMounting = true;
                animator.transition(target);
                deleteMorphTarget(morph, target.id);
                animator.state = 'mounted';
                setSkipMount(true);

                target.delayUnmountUntil = 0;
                target.unmount(); // testing (breaks with quick re-mounts)
            }
        }

        registerToLayoutGroup(layoutId, animator.id); // needed?
        if (skipMount) animator.state = 'mounted';

        document.fonts.ready.finally(() => animator.mount());

        const updateAnimatorCache = () => animator.forEachTrack(track => track.snapshot());
        window.addEventListener('resize', updateAnimatorCache); // throttle?

        return () => {
            window.removeEventListener('resize', updateAnimatorCache);

            animator.dispose(morph);
            unregisterFromLayoutGroup(layoutId, animator.id);
        }
    }, []);

    useEffect(() => {
        forEachTrigger(triggers, (animation, list, options) => {
            const previous = previousTriggers.current[animation];

            list.forEach((value, i) => {
                if (previous[i] !== value && value !== false) animator.play(animation, Object.assign({ tag: animation }, options[i]));

                previous[i] = value;
            });
        });
    }, [triggers]);

    useEffect(() => {
        if (animate instanceof Clip || animator.state !== 'mounted') return;

        for (const key in animate) {
            const value = animate[key as ClipKey];
            const link = animator.links[key as ClipKey];

            if (!link || typeof value === 'object') continue;

            link.set(value, {
                duration: animate.duration,
                easing: animate.easing,
                composite: animate.composite
            });
        }
    }, [animate]);

    useEffect(() => {
        if (onAnimationEnd) animator.on('animationend', onAnimationEnd);

        return () => {
            if (onAnimationEnd) animator.off('animationend', onAnimationEnd);
        }
    }, [onAnimationEnd]);

    useEffect(() => animator.setPlayState(paused), [paused]);

    return <AnimateContext value={animator.id}>
        {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            let { ref, style } = (child as React.ReactElement<React.HTMLProps<any>>).props;
            style = mergeStyles(
                style,
                animator.mergeInitialStyles(initial, skipMount ? 'mounted' : 'unmounted'),
                getInitialStyleFromLinks(animator.links, i)
            );

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: mergeRefs(
                    ref || null,
                    el => animator.addTrack(el, i)
                ),
                style,
                ['pathLength' as any]: 'strokeDasharray' in style ? 1 : undefined,
                ['data-lively' as any]: animator.id
            });
        })}
    </AnimateContext>;
}