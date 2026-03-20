'use client';

import { cloneElement } from "react";
import Animate, { AnimateProps } from "../animate";
import { useVisible } from "../hooks";
import Clip, { ClipOptions } from "../core/clip";

export default function ViewAnimation({
    children,
    enter,
    exit = {},
    maxEnters = 1,
    maxExits = 0,
    ...props
}: Omit<AnimateProps<any>, 'children' | 'animate' | 'clips' | 'triggers' | 'stagger' | 'staggerLimit'> & {
    children: React.ReactElement<any>;
    enter: ClipOptions | Clip;
    exit?: ClipOptions | Clip;
    maxEnters?: number;
    maxExits?: number;
}) {
    const [ref, enters, exits] = useVisible(0);

    return <Animate
        {...props}
        clips={{
            enter,
            exit
        }}
        triggers={{
            enter: [Math.min(enters, maxEnters)],
            exit: [Math.min(exits, maxExits)]
        }}>
        {cloneElement(children, { ref })}
    </Animate>;
}