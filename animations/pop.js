import Animation from '../animation';

export default function Pop(options = {}) {
    return {
        scaleCorrection: options.scaleCorrection,
        use: Pop.use.bind(this, options)
    };
}

Pop.use = ({ scaleCorrection = false } = {}) => {
    return new Animation({ opacity: 1, scale: 1, scaleCorrection, duration: 0.25 }, { opacity: 0, scale: 0.85 });
}