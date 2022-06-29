import Animation from '../animation';

export default function Fade(options = {}) {
    return {
        scaleCorrection: options.scaleCorrection,
        use: Fade.use.bind(this, options)
    };
}

Fade.use = ({ scaleCorrection = false } = {}) => {
    return new Animation({ opacity: 1, scaleCorrection, duration: 0.65 }, { opacity: 0 });
}