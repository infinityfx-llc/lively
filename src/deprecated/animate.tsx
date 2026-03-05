'use client';

import { Children, cloneElement, isValidElement } from "react";
import Animatable, { AnimatableProps } from "./animatable";
import Clip, { ClipProperties } from "./core/clip";

type AnimateProps = {
    animations?: (ClipProperties | Clip)[];
    /**
     * The number of levels to cascade down animations.
     */
    levels?: number;
} & Omit<AnimatableProps, 'animations' | 'animate' | 'order'>;

/**
 * Automated cascade animations.
 * 
 * @see {@link https://lively.infinityfx.dev/docs/components/animate}
 */
export default function Animate({ children, animations = [{ translate: ['0px 16px', '0px 0px'], opacity: [0, 1], duration: .35 }], levels = 2, ...props }: AnimateProps) {

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

Animate.isLively = true;