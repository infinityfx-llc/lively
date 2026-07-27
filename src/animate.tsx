'use client';

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from "react";
import Animator, { AnimationOptions, AnimationTrigger, ScaleCorrection } from "./core/animator";
import Clip, { ClipInitials, ClipKey, ClipOptions } from "./core/clip";
import { forEachTrigger, getLifeCycleAnimations, mergeRefs, serializeTriggers, mergeStyles, synchronizeTriggers } from "./core/utils";
import { CacheKey, CorrectionAlignment } from "./core/track";
import { LayoutGroupContext } from "./layout-group";
import { deleteMorphTarget, getMorphTarget } from "./core/state";
import { TransitionOptions } from "./core/animation-link";

// todo: easy way to set willChange?

export type AnimateTriggers<T extends string> = {
    [key in T]?: (AnimationTrigger | { on: AnimationTrigger, end?: number | boolean } & AnimationOptions)[];
};

export type AnimateProps<T extends string> = {
    ref?: React.Ref<Animator<T | 'animate'>>;
    children: React.ReactNode;
    /**
     * Whether to inherit animation clips from a parent `Animate` and let animation triggers cascade.
     * 
     * @default false
     */
    inherit?: boolean | number;
    /**
     * Starting animation values
     * 
     * @default {}
     */
    initial?: ClipInitials | T | 'animate';
    /**
     * Defines the default animation that is played on mount.
     * 
     * Allows for the passing of `AnimationLinks` to dynamically animate properties.
     * 
     * @default {}
     */
    animate?: ClipOptions | Clip;
    /**
     * Defines a map of named animations that can be referenced within `triggers`.
     * 
     * @default {}
     */
    clips?: {
        [key in T]: ClipOptions | Clip;
    };
    /**
     * A key/value map linking a specific animation to a reactive value, allowing the animation to trigger when the value changes.
     * 
     * Additionally accepts either `'mount'` or `'unmount'` as trigger values.
     * 
     * @default { animate: ['mount'] }
     */
    triggers?: AnimateTriggers<T | 'animate'>;
    /**
     * By how seconds to stagger animations for multiple elements.
     * 
     * @default .07
     */
    stagger?: number;
    /**
     * Limits the number of elements to stagger their animation.
     * 
     * Any elements exceeding this limit will animate all at once.
     * 
     * @default 10
     */
    staggerLimit?: number;
    /**
     * Enables correction of border radii, box shadows and child elements when animating scale.
     * 
     * If an alignment object is passed will behave as `'both'`.
     * 
     * @default 'self'
     */
    correction?: CorrectionAlignment | ScaleCorrection;
    /**
     * Allows for configuring transition animations that play when an element morphs or changes layout.
     * 
     * Layout change detection requires a parent `LayoutGroup` component.
     * 
     * @default { cache: ['x', 'y', 'sx', 'sy', 'rotate', 'borderRadius'] }
     */
    transition?: (TransitionOptions & {
        /**
         * An array of animatable properties that determine which properties to transition between.
         */
        cache?: CacheKey[];
    }) | boolean;
    /**
     * An optional globally unique id which enables morph animations when set.
     * 
     * Elements with the same id to morph into eachother when simultaneously removed/added to the DOM.
     */
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
    correction,
    transition,
    morph,
    clips,
    paused = false,
    onAnimationEnd
}: AnimateProps<T>) {
    const id = (triggers as any)._livelyId ?? '_la' + useId();
    const parentId = use(AnimateContext);
    const layoutGroup = use(LayoutGroupContext);

    const clipInitials = typeof initial === 'string' ? {} : initial;
    const previousTriggers = useRef(serializeTriggers(triggers));
    const skipMount = useRef(layoutGroup ? layoutGroup.skipInitialMount : false);
    const data = useRef<Animator<any>>(null);

    if (!data.current) {
        const animations: {
            [key in T | 'animate']: Clip;
        } = {
            animate: animate instanceof Clip ? animate : new Clip(animate, clipInitials, true)
        } as any;

        for (const name in clips) animations[name] = clips[name] instanceof Clip ? clips[name] : new Clip(clips[name], clipInitials);

        const animator = data.current = new Animator({
            id,
            clips: animations,
            lifeCycleAnimations: getLifeCycleAnimations(triggers),
            correction,
            transition,
            stagger,
            staggerLimit,
            morph
        });

        animator.register(parentId, inherit, morph);
    }

    const { current: animator } = data;
    animator.addLinks(animate, clipInitials);

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        animator.register(parentId, inherit, morph);

        if (animator.morphId && animator.state !== 'mounted') {
            const target = getMorphTarget(animator.morphId, animator.id); // TODO: gets self as target when id changes between renders..

            if (target) {
                animator.isMounting = true;
                animator.applyStyles('mounted');
                animator.transition(target);
                animator.state = 'mounted';

                target.delayUnmountUntil = 0; // fallback for multiple seperate layoutgroups
                target.applyStyles('unmounted');
                setTimeout(() => deleteMorphTarget(animator.morphId, target.id), 1);
            }
        }

        if (layoutGroup) {
            layoutGroup.animators.add(animator.id);
            if (skipMount.current = layoutGroup.skipInitialMount) animator.state = 'mounted';
        }

        document.fonts.ready.finally(() => animator.mount());

        const updateAnimatorCache = () => animator.cacheTracks();
        window.addEventListener('resize', updateAnimatorCache);

        return () => {
            window.removeEventListener('resize', updateAnimatorCache);

            animator.dispose();
            if (layoutGroup) layoutGroup.animators.delete(animator.id);
        }
    }, []);

    useEffect(() => {
        forEachTrigger(triggers, (animation, list) => {
            const previous = previousTriggers.current[animation] || [];

            const { play, stop, options } = synchronizeTriggers(list, previous);

            if (play) animator.play(animation, Object.assign({ tag: animation }, options));
            if (stop) animator.stop(animation);
        });
    }, [triggers]);

    useEffect(() => {
        if (animate instanceof Clip || animator.state !== 'mounted') return;

        for (const key in animate) {
            const value = animate[key as ClipKey];
            const link = animator.links[key as ClipKey];

            if (!link || typeof value === 'object') continue;

            const options: TransitionOptions = {};
            (['duration', 'easing', 'composite'] as const).forEach(key => {
                if (key in animate) options[key] = animate[key] as any;
            });

            link.set(value, options);
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
            style = mergeStyles(style, animator.getInitialStyles(initial, skipMount.current ? 'mounted' : 'unmounted', i));

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