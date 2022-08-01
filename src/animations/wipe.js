// import Animation from '../animation';
import Animation from '../core/animation';

export default function Wipe(options = {}) {
    Wipe.use = Wipe.use.bind(Wipe, options);
    return Wipe;
}

Wipe.use = ({ direction = 'right', ...options } = {}) => {
    if (!['left', 'right', 'top', 'bottom'].includes(direction)) direction = 'right';
    
    return new Animation({ clip: { [direction]: 0 }, ...options }, { clip: { [direction]: 1 } });
}