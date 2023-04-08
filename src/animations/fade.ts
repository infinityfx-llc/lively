import Clip from "../core/clip";

const Fade = new Clip({
    opacity: 1,
    duration: 0.65
}, {
    opacity: 0
});

export default Fade;