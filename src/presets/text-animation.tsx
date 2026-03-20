'use client';

import Animate, { AnimateProps } from "../animate";

export type ReactText = string | number | boolean | null | undefined | ReactText[];

export default function TextAnimation({
    children,
    duration = 1,
    ...props
}: Omit<AnimateProps<any>, 'stagger' | 'staggerLimit'> & {
    duration?: number;
}) {
    let i = 0;

    const array = Array.isArray(children) ? children : [children];
    const characters = array.map(child => {
        if (!['string', 'number'].includes(typeof child)) return child;

        return (child as string | number)
            .toString()
            .split('')
            .map(char => <span key={i++} style={{
                display: 'inline-block',
                whiteSpace: 'pre-wrap'
            }}>{char}</span>);
    }).flat();

    return <Animate {...props} stagger={duration / characters.length} staggerLimit={Number.MAX_VALUE}>
        {characters}
    </Animate>;
}