// - notes:
// - keep cascade and clip reversing seperate
// - store clips in animator
// - myAnimationOn={trigger} <- use typescript generics?
// - with global state construct virtual element tree that can be used for unmounting logic

import { Children, cloneElement, createContext, isValidElement, use, useId, useLayoutEffect, useRef } from "react";
import Animator from "./core/animator";

type AnimateProps = {
    children: React.ReactNode;
    inherit?: boolean | number;
    clips?: {};
};

export const AnimateContext = createContext<string>('');

export default function Animate({ children, inherit = false, clips = {} }: AnimateProps) {
    const id = useId();
    const parentId = use(AnimateContext);
    const animator = useRef(new Animator(id, parentId, inherit));

    useLayoutEffect(() => {
        document.fonts.ready.finally(animator.current.mount);

        return () => { };
    }, []);

    return <AnimateContext value={id}>
        {Children.map(children, child => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<React.HTMLProps<any>>, {
                ref: (el: any) => animator.current.addTrack(el),
                style: animator.current.getInitial()
            });
        })}
    </AnimateContext>;
}
