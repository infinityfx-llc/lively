import React from 'react';
import Animatable from '../animatable';

export default function WriteOn({ children, className, style, duration }) {

    if (typeof children !== 'string') return children;

    const chars = children.split('');

    return (
        <div className={className} style={style}>
            <Animatable whileViewport animate={{ opacity: 1, position: { y: 0 }, rotation: 0, duration: 0.8 }} initial={{ opacity: 0, position: { y: '100%' }, rotation: 10 }} stagger={(duration - 0.8) / (chars.length - 1)}>
                {chars.map((char, i) => {
                    return <span style={{ display: 'inline-block' }} key={i}>{/\s/.test(char) ? '\u00A0' : char}</span>;
                })}
            </Animatable>
        </div>
    );

}

WriteOn.defaultProps = {
    style: {},
    className: "",
    duration: 1.6
};