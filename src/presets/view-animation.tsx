'use client';

import { cloneElement, isValidElement } from "react";
import Animate, { AnimateProps } from "../animate";
import { useVisible } from "../hooks";
import Clip, { ClipOptions } from "../core/clip";
import { mergeRefs } from "../core/utils";

export default function ViewAnimation({
    children,
    enter,
    exit = {},
    maxEnters = 1,
    maxExits = 0,
    ...props
}: Omit<AnimateProps<'enter' | 'exit'>, 'children' | 'animate' | 'clips' | 'triggers' | 'stagger' | 'staggerLimit'> & {
    children: React.ReactElement;
    enter: ClipOptions | Clip;
    exit?: ClipOptions | Clip;
    maxEnters?: number;
    maxExits?: number;
}) {
    const [ref, enters, exits] = useVisible(0);

    return <Animate
        {...props}
        initial={props.initial || 'enter'}
        clips={{
            enter,
            exit
        }}
        triggers={{
            enter: [{ on: Math.min(enters, maxEnters), override: true }],
            exit: [{ on: Math.min(exits, maxExits), override: true }]
        }}>
        {isValidElement(children) ?
            cloneElement(children, {
                // @ts-expect-error
                ref: mergeRefs(children.props.ref || null, ref)
            }) :
            children}
    </Animate>;
}