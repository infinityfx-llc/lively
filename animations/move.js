import Animation from '../animation';

export default function Move(options = {}) {
    return {
        scaleCorrection: options.scaleCorrection,
        use: Move.use.bind(this, options)
    };
}

Move.use = ({ direction = 'up', scaleCorrection = false } = {}) => {

    let x = '0px', y = '20px';
    switch (direction) {
        case 'down': y = '-20px';
        break;
        case 'left': x = '20px', y = '0px';
        break;
        case 'right': x = '-20px', y = '0px';
        break;
    }
    
    return new Animation({ position: { x: '0px', y: '0px' }, opacity: 1, scaleCorrection, duration: 0.5 }, { position: { x, y }, opacity: 0 });
}