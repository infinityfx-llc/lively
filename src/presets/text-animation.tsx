'use client';

import Animate, { AnimateProps } from "../animate";

export type ReactText = string | number | boolean | null | undefined | ReactText[];

export default function TextAnimation<T extends string>({
    children,
    duration = 1,
    split = 'char',
    ...props
}: Omit<AnimateProps<T>, 'stagger' | 'staggerLimit'> & {
    /**
     * Total duration of the text animation.
     * 
     * @default 1
     */
    duration?: number;
    /**
     * Whether to break up text per character or per word.
     * 
     * @default 'char'
     */
    split?: 'char' | 'word';
}) {
    let i = 0;

    const array = Array.isArray(children) ? children : [children];
    const characters = array.map(child => {
        if (!['string', 'number'].includes(typeof child)) return child;

        const str = child.toString() as string;
        const array = split === 'char' ? str.split('') : str.split(/(\s)/g);

        return array.map(char => <span key={i++} style={{
            display: 'inline-block',
            whiteSpace: 'pre-wrap'
        }}>{char}</span>);
    }).flat();

    return <Animate {...props} stagger={duration / characters.length} staggerLimit={Number.MAX_VALUE}>
        {characters}
    </Animate>;
}