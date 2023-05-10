import { Children, ForwardedRef, forwardRef } from "react";
import Animatable, { AnimatableProps, AnimatableType } from "../animatable";

const Typable = forwardRef(({ children, stagger = 1, staggerLimit = Number.MAX_VALUE, ...props }: AnimatableProps, ref: ForwardedRef<AnimatableType>) => {

    return <Animatable {...props} ref={ref} stagger={stagger * -1} staggerLimit={staggerLimit}>
        {Children.map(children, child => {
            if (typeof child === 'string') {
                return child.split('').map(char => <span style={{ minWidth: char === ' ' ? '0.35em' : 0 }}>{char}</span>);
            }

            return typeof child === 'number' || typeof child === 'boolean' ? <div>{child}</div> : child;
        })}
    </Animatable>;
});

export default Typable;