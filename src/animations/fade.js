import Animation from './animation';

const Fade = Animation.create(options => {
    return [{ opacity: 1, duration: 0.65, ...options }, { opacity: 0 }];
});

export default Fade;