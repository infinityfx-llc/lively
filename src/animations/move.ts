import Clip from "../core/clip";

const Move = new Clip({
    opacity: 1,
    translate: '0px 0px',
    duration: 0.5
}, {
    opacity: 0,
    translate: '0px 20px'
});

export default Move;