// - notes:
// - myAnimationOn={trigger} <- use typescript generics?
// - with global state construct virtual element tree that can be used for unmounting logic
// - consider what props to cascade; (clips, stagger, etc.)

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef } from "react";
import Animator from "./core/animator";
import Clip, { ClipInitials, ClipOptions } from "./core/clip2";

type AnimateProps<T extends string> = {
    ref?: React.Ref<Animator<T>>;
    children: React.ReactNode;
    inherit?: boolean | number;
    initial?: ClipInitials;
    animate?: ClipOptions | Clip;
    clips?: {
        [key in T]: ClipOptions | Clip;
    };
    triggers?: any; // todo
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
    stagger,
    staggerLimit,
    clips,
    paused = false
}: AnimateProps<T>) {
    const id = useId();
    const parentId = use(AnimateContext);
    const animator = useMemo(() => {
        const animations: {
            [key in (T | 'mount')]: Clip;
        } = {
            mount: new Clip(animate, initial) // don't create clip if already of Clip instance
        } as any;

        for (const name in clips) animations[name] = new Clip(clips[name], initial);

        return new Animator<T>({ id, parentId, inherit, clips: animations, stagger, staggerLimit });
    }, []);

    useImperativeHandle(ref, () => animator, []);

    useLayoutEffect(() => {
        document.fonts.ready.finally(animator.mount);

        return () => animator.dispose();
    }, []);

    useEffect(() => {
        animator.interrupted = paused;
    }, [paused]);

    return <AnimateContext value={id}>
        {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: (el: any) => animator.addTrack(el, i),
                style: animator.getInitialStyles()
            });
        })}
    </AnimateContext>;
}