import Animation from './animation';

const Move = Animation.create(({ direction = 'up', ...options }) => {
    let x = '0px', y = '20px';
    switch (direction) {
        case 'down': y = '-20px';
            break;
        case 'left': x = '20px', y = '0px';
            break;
        case 'right': x = '-20px', y = '0px';
            break;
    }

    return [{ position: { x: 0, y: 0 }, opacity: 1, duration: 0.5, ...options }, { position: { x, y }, opacity: 0 }];
});

export default Move;