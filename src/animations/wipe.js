import Animation from '../animation';

export default function Wipe(options = {}) {
    return {
        scaleCorrection: options.scaleCorrection,
        use: Wipe.use.bind(this, options)
    };
}

Wipe.use = ({ direction = 'right', scaleCorrection = false } = {}) => {
    if (!['left', 'right', 'top', 'bottom'].includes(direction)) direction = 'right';
    return new Animation({ clip: { [direction]: 0 }, scaleCorrection }, { clip: { [direction]: 1 } });
}