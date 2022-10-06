import React from 'react';
import Animatable from '../animatable';
import { isStr } from '../core/utils/helper';

export default function WriteOn({ children, className, style, duration }) {

    if (!isStr(children)) return children; // maybe dont import is here

    const chars = children.split('');

    return (
        <div className={className} style={style}>
            <Animatable whileViewport animate={{ opacity: 1, translate: { y: 0 }, rotate: 0, duration: 0.8 }} initial={{ opacity: 0, translate: { y: '100%' }, rotate: 10 }} stagger={(duration - 0.8) / (chars.length - 1)}>
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