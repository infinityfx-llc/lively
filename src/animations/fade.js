import Animation from '../animation';

export default function Fade(options = {}) {
    Fade.use = Fade.use.bind(Fade, options);
    return Fade;
}

Fade.use = (options = {}) => {
    return new Animation({ opacity: 1, duration: 0.65, ...options }, { opacity: 0 });
}