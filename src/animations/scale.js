import Animation from '../animation';

export default function Scale(options = {}) {
    Scale.use = Scale.use.bind(Scale, options);
    return Scale;
}

Scale.use = ({ direction = 'right', ...options } = {}) => {
    let x = 0, y = 1, origin = { x: 0, y: 0.5 };
    switch (direction) {
        case 'left': origin.x = 1;
        break;
        case 'up': x = 1, y = 0, origin = { x: 0, y: 1 };
        break;
        case 'down': x = 1, y = 0, origin = { x: 0, y: 0 };
        break;
    }

    return new Animation({ scale: { x: 1 }, origin, duration: 0.6, ...options }, { scale: { x, y } });
}