import Animation from './animation';

const Pop = Animation.create(options => {
    return [{ opacity: 1, scale: 1, duration: 0.25, ...options }, { opacity: 0, scale: 0.85 }];
});

export default Pop;