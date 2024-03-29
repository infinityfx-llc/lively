'use client';

import { Children, ForwardedRef, forwardRef } from "react";
import Animatable, { AnimatableProps, AnimatableType } from "../animatable";

const Typable = forwardRef(({ children, stagger = 1, staggerLimit = Number.MAX_VALUE, ...props }: AnimatableProps, ref: ForwardedRef<AnimatableType>) => {

    return <Animatable {...props} ref={ref} stagger={stagger * -1} staggerLimit={staggerLimit}>
        {Children.map(children, child => {
            if (typeof child !== 'string' && typeof child !== 'number') return child;

            return child
                .toString()
                .split('')
                .map(char => <span style={{ whiteSpace: char === ' ' ? 'pre-wrap' : undefined }}>{char}</span>);
        })}
    </Animatable>;
});

Typable.displayName = 'Typable';

export default Typable;