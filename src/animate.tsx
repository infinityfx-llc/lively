'use client';

import { Children, cloneElement, isValidElement } from "react";
import Animatable, { AnimatableProps } from "./animatable";
import Move from "./animations/move";
import Pop from "./animations/pop";
import Clip, { ClipProperties } from "./core/clip";

type AnimateProps = { animations?: (ClipProperties | Clip)[]; levels?: number; } & Omit<AnimatableProps, 'animations' | 'animate' | 'order'>;

export default function Animate({ children, animations = [Move, Pop], levels = 2, ...props }: AnimateProps) {

    function render(children: React.ReactNode, level = levels) {
        let idx = levels - level, clip;

        while (!(clip = animations[idx]) && idx >= 0) idx--;

        if (level < 1 || Children.count(children) < 1) return children;

        return <Animatable {...props} animate={clip} inherit={level < levels ? true : props.inherit}>
            {Children.map(children, child => {
                if (!isValidElement(child)) return child;

                return cloneElement(child, {}, render((child as React.ReactElement<any>).props.children, level - 1));
            })}
        </Animatable>
    }

    return <>{render(children)}</>;
}