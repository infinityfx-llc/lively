import Animation from './animation';

const Wipe = Animation.create(({ direction = 'right', ...options }) => {
    if (!['left', 'right', 'top', 'bottom'].includes(direction)) direction = 'right';

    return [{ clip: { [direction]: 0 }, ...options }, { clip: { [direction]: 1 } }];
});

export default Wipe;