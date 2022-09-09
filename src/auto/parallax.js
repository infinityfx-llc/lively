import React, { useRef } from 'react';
import Animatable from '../animatable';
import { useScroll } from '../hooks';

// maybe check if overflow needs to be fixed for larger parallax values (body scrollheight increases unintentionally)

export default function Parallax({ children, amount }) {
    const scroll = useScroll();
    const ref = useRef();
    let offset;

    return (
        <Animatable ref={ref} animate={{
            position: scroll(val => {
                if (offset === undefined) {
                    const el = ref.current?.elements[0];
                    if (el) offset = Math.max(el.getBoundingClientRect().y + window.scrollY - window.innerHeight / 2, 0);
                }

                return { x: 0, y: (val - (offset || 0)) * amount };
            })
        }}>
            {children}
        </Animatable>
    );
}

Parallax.defaultProps = {
    amount: 0.5
};