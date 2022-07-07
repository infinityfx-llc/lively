import Animation from '../animation';

export default function Pop(options = {}) {
    Pop.use = Pop.use.bind(Pop, options);
    return Pop;
}

Pop.use = (options = {}) => {
    return new Animation({ opacity: 1, scale: 1, duration: 0.25, ...options }, { opacity: 0, scale: 0.85 });
}