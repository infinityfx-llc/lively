import { AnimationOptions } from "./animator";
import Clip from "./clip2";

export default class Track {

    element: Element;
    queue: Animation[] = [];
    animations: Animation[] = [];
    active = 0;

    constructor(element: Element) {
        this.element = element;
    }

    push(clip: Clip, options: AnimationOptions) {
        const config = clip.getConfig(options);
        const animation = this.element.animate({}, config);
        animation.onfinish = () => {
            try {
                if (config.commit) animation.commitStyles();
            } finally {
                animation.cancel();
                this.advance();
                // onAnimationEnd callback?
            }
        };

        if (this.active && config.composite === 'none') {
            animation.pause();
            this.queue.push(animation);
        } else {
            this.animations.push(animation);
            if (config.composite === 'none') this.active++;
        }

        return 0; // todo: return duration + delay
    }

    advance() {
        if (--this.active > 0) return;

        this.animations = this.animations.filter(animation => animation.playState === 'running');
        this.animations.push(...this.queue.splice(0, 1));
        this.active = this.animations.filter(animation => animation.effect.composite === 'none').length;
    }

    clear() {

    }

    toggle(paused: boolean) {
        this.animations.forEach(animation => animation[paused ? 'pause' : 'play']());
    }

}