import React, { useRef } from 'react';
import Animatable from '../animatable';
import { useScroll } from '../hooks';

export default function Parallax({ children, amount }) {
    const scroll = useScroll();
    // const ref = useRef();
    // const offset = useRef();

    return (
        <Animatable animate={{
            position: scroll(val => {
                // const y = ref.current?.elements[0]?.getBoundingClientRect().y;
                // if (offset.current === undefined && y !== undefined) offset.current = y;

                // return { x: 0, y: (val - (offset.current || 0)) * amount };
                return { x: 0, y: val * amount };
            })
        }}>
            {children}
        </Animatable>
    );
}

Parallax.defaultProps = {
    amount: 0.5
};