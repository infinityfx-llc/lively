import React, { cloneElement } from 'react';
import Animatable from '../animatable';

export default function ColorWipe({ children, color, duration }) {

    let subChildren = children.props?.children || [];
    if (!Array.isArray(subChildren)) subChildren = [subChildren];

    subChildren.unshift(
        <Animatable key={0} initial={{ clip: { right: 0 } }} animate={{ clip: { left: 1 }, duration: duration / 2 }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: color
            }}></div>
        </Animatable>
    );

    return (
        <Animatable whileViewport animate={{ clip: { right: 0 }, duration: duration / 2 }} initial={{ clip: { right: 1 } }}>
            {cloneElement(children, {}, subChildren)}
        </Animatable>
    );

}

ColorWipe.defaultProps = {
    color: "grey",
    duration: 1.6
};