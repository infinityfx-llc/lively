// - notes:
// - with global state construct virtual element tree that can be used for unmounting logic
// - consider what props to cascade; (clips, stagger, etc.)

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef } from "react";
import Animator from "./core/animator";
import Clip, { ClipInitials, ClipOptions } from "./core/clip2";
import { serializeTriggers } from "./core/utils2";

type AnimationTrigger = 'mount' | 'unmount' | boolean | number;

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
    stagger,
    staggerLimit,
    clips,
    paused = false
}: AnimateProps<T>) {
    const id = useId();
    const parentId = use(AnimateContext);

    const previousTriggers = useRef(serializeTriggers(triggers));
    const animator = useMemo(() => {
        const animations: {
            [key in T | 'animate']: Clip;
        } = {
            animate: new Clip(animate, initial) // don't create clip if already of Clip instance
        } as any;

        for (const name in clips) animations[name] = new Clip(clips[name], initial);

        return new Animator({ id, parentId, inherit, clips: animations, stagger, staggerLimit });
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
        animator.interrupted = paused;
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