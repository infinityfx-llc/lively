'use client';

import { Children } from "react";
import Animatable, { AnimatableProps } from "../animatable";

export default function Typable({ children, stagger = 1, staggerLimit = Number.MAX_VALUE, ...props }: AnimatableProps) {

    return <Animatable {...props} stagger={stagger * -1} staggerLimit={staggerLimit}>
        {Children.map(children, child => {
            if (typeof child !== 'string' && typeof child !== 'number') return child;

            return child
                .toString()
                .split('')
                .map(char => <span style={{ whiteSpace: char === ' ' ? 'pre-wrap' : undefined }}>{char}</span>);
        })}
    </Animatable>;
}

Typable.isLively = true;