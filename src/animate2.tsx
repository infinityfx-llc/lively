// - notes:
// - myAnimationOn={trigger} <- use typescript generics?
// - with global state construct virtual element tree that can be used for unmounting logic
// - consider what props to cascade; (clips, stagger, etc.)

import { Children, cloneElement, createContext, isValidElement, use, useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import Animator from "./core/animator";
import Clip from "./core/clip2";

type AnimateProps<T extends string> = {
    children: React.ReactNode;
    inherit?: boolean | number;
    initial?: {};
    animate?: {};
    clips?: {
        [key in T]: Clip; // or properties
    };
    paused?: boolean;
};

export const AnimateContext = createContext<string>('');

export default function Animate<T extends string>({
    children,
    inherit = false,
    initial = {},
    animate = {},
    clips,
    paused = false
}: AnimateProps<T>) {
    const id = useId();
    const parentId = use(AnimateContext);
    const animator = useMemo(() => {
        const animations: {
            [key in (T | 'mount')]: Clip;
        } = {
            mount: new Clip(animate, initial)
        } as any;

        for (const name in clips) animations[name] = new Clip(clips[name], initial);

        return new Animator<T>({ id, parentId, inherit, clips: animations });
    }, []);

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
