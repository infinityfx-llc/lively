import { Children } from "react";
import Animatable, { AnimatableProps } from "../animatable";

export default function Typable({ children, ...props }: AnimatableProps) { // might need to forward ref

    return <Animatable {...props} stagger={-1} staggerLimit={Number.MAX_VALUE}>
        {Children.map(children, child => {
            if (typeof child === 'string') {
                return child.split('').map(char => <span style={{ minWidth: char === ' ' ? '0.35em' : 0 }}>{char}</span>);
            }

            return typeof child === 'number' || typeof child === 'boolean' ? <div>{child}</div> : child;
        })}
    </Animatable>;
}