import { Children, cloneElement, forwardRef, isValidElement } from "react";
import Animatable, { AnimatableProps, AnimatableType } from "./animatable__EXP";
import Move from "./animations/move";
import Pop from "./animations/pop";
import Clip, { ClipProperties } from "./core/clip";

type AnimateProps = { children: React.ReactNode; animations?: (ClipProperties | Clip)[]; levels?: number; } & Omit<AnimatableProps, 'animations' | 'animate' | 'noInherit' | 'order'>;

const Animate = forwardRef<AnimatableType, AnimateProps>(({ children, animations = [Move, Pop], levels = 2, ...props }, ref) => {

    function render(children: React.ReactNode, level = levels) {
        let idx = levels - level, clip;

        while (!(clip = animations[idx]) && idx >= 0) idx--;

        if (level < 1 || Children.count(children) < 1) return children;

        return <Animatable {...props} ref={ref} animate={clip} inherit={level < levels}>
            {Children.map(children, child => {
                if (!isValidElement(child)) return child;

                return cloneElement(child, {}, render(child.props.children, level - 1));
            })}
        </Animatable>
    }

    return <>{render(children)}</>;
});

export default Animate;