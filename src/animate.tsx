'use client';

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from "react";
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
    deformCorrection?: CorrectionAlignment | boolean;
    transition?: TransitionOptions & { // add option to mark element as position:fixed (to avoid problems with scroll offset)
        cache?: CacheKey[];
    };
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
            deformCorrection,
            transition,
            stagger,
            staggerLimit
        });

        animator.register(parentId, inherit, morph);
        animator.addLinks(animate);
    }
    const { current: animator } = data;
    const skipMount = useRef(registerToLayoutGroup(layoutId, animator.id));

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        mounted.current = Date.now();
        animator.register(parentId, inherit, morph);
        animator.addLinks(animate);

        if (morph) {
            const target = morphTarget.current || getMorphTarget(morph, animator.id);
            morphTarget.current = target;

            if (target) {
                animator.isMounting = true;
                animator.transition(target);
                deleteMorphTarget(morph, target.id);
                animator.state = 'mounted'; // should add mounted initial styles somehow as well (only if not swapping/reversing)
                skipMount.current = true; // testing ^ (doesn't work, will need force re-render)

                target.delayUnmountUntil = 0;
                // ^ doesn't work instantly..
            }
        }

        registerToLayoutGroup(layoutId, animator.id); // needed?
        if (skipMount.current) animator.state = 'mounted';

        document.fonts.ready.finally(() => animator.mount());

        const updateAnimatorCache = () => animator.forEachTrack(track => track.snapshot());
        window.addEventListener('resize', updateAnimatorCache);

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
            if (!(key in animator.links) || typeof value === 'object') continue;

            animator.links[key as ClipKey]!.set(value, {
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
                animator.mergeInitialStyles(initial, skipMount.current ? 'mounted' : 'unmounted'),
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