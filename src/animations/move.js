import Animation from '../animation';

export default function Move(options = {}) {
    Move.use = Move.use.bind(Move, options);
    return Move;
}

Move.use = ({ direction = 'up', ...options } = {}) => {

    let x = '0px', y = '20px';
    switch (direction) {
        case 'down': y = '-20px';
        break;
        case 'left': x = '20px', y = '0px';
        break;
        case 'right': x = '-20px', y = '0px';
        break;
    }
    
    return new Animation({ position: { x: '0px', y: '0px' }, opacity: 1, duration: 0.5, ...options }, { position: { x, y }, opacity: 0 });
}