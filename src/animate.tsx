'use client';

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from "react";
import Animator, { AnimationOptions, AnimationTrigger } from "./core/animator";
import Clip, { ClipInitials, ClipKey, ClipOptions } from "./core/clip";
import { forEachTrigger, getLifeCycleAnimations, activateAnimationLinks, mergeRefs, serializeTriggers } from "./core/utils";
import { CacheKey } from "./core/track";
import { LayoutGroupContext } from "./layout-group";
import { deleteMorphTarget, getMorphTarget, registerAsMorph, registerToLayoutGroup, unregisterFromLayoutGroup } from "./core/state";
import AnimationLink from "./core/animation-link";

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
    cache = ['x', 'y', 'sx', 'sy', 'rotate', 'borderRadius'], // default: []? (maybe export some default presets of options?)
    morph,
    clips,
    paused = false,
    onAnimationEnd
}: AnimateProps<T>) {
    const id = '_la' + useId();
    const parentId = use(AnimateContext);
    const layoutId = use(LayoutGroupContext);
    (triggers as any)._livelyId = id; // on re-render doesn't get assigned in time for parent to read..

    const links = useRef<{
        [key in ClipKey]?: AnimationLink<any>;
    }>({});
    const previousTriggers = useRef(serializeTriggers(triggers));
    const data = useRef<Animator<any>>(null);
    if (!data.current) {
        const animations: {
            [key in T | 'animate']: Clip;
        } = {
            animate: animate instanceof Clip ? animate : new Clip(animate, initial)
        } as any;

        for (const name in clips) animations[name] = clips[name] instanceof Clip ? clips[name] : new Clip(clips[name], initial);

        data.current = new Animator({
            id,
            clips: animations,
            lifeCycleAnimations: getLifeCycleAnimations(triggers),
            ignoreScaleDeformation,
            cache,
            stagger,
            staggerLimit
        });

        data.current.register(parentId, inherit);
    }
    const { current: animator } = data;

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        const [animationLinks, disposeAnimationLinks] = activateAnimationLinks(animate, (key, link) => {
            animator.forEachTrack((track, i) => {
                const clip = new Clip({
                    ...link.options,
                    composite: 'override',
                    [key]: link.get(i)
                });

                track.push(clip, {}, i === animator.tracks.size ? () => animator.dispatch('animationend') : undefined); // callback needed?
            });
        });
        links.current = animationLinks;

        animator.register(parentId, inherit);

        if (morph) { // <- clean up code
            const target = getMorphTarget(morph);
            registerAsMorph(morph, id);

            if (target) {
                animator.transition(target); // pass transition options?
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
            disposeAnimationLinks();
            unregisterFromLayoutGroup(layoutId, id);
            animator.dispose();

            window.removeEventListener('resize', updateAnimatorCache);
        }
    }, []);

    useLayoutEffect(() => {
        if (animator.state !== 'mounted' || !cache.length) return;

        animator.transition();
    });

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
            if (key in links.current) {
                links.current[key as ClipKey]!.set(animate[key as ClipKey], {
                    duration: animate.duration,
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
            style = Object.assign({}, style);

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: mergeRefs(
                    ref || null,
                    el => animator.addTrack(el, i)
                ),
                style: Object.assign(style, animator.mergeInitialStyles(initial)),
                ['data-lively' as any]: true
            });
        })}
    </AnimateContext>;
}