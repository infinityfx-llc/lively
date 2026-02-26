import { AnimationOptions } from "./animator";
import Clip, { BlendMode } from "./clip2";

type TrackAnimation = Animation & {
    blendmode: BlendMode;
}

export default class Track {

    element: Element;
    queue: TrackAnimation[] = [];
    animations: TrackAnimation[] = [];
    active = 0;

    constructor(element: Element) {
        this.element = element;
    }

    push(clip: Clip, options: AnimationOptions, onEnded?: () => void) {
        const { commit, blendmode, ...config } = clip.getConfig(options);
        const animation = this.element.animate({}, config) as TrackAnimation;
        animation.blendmode = blendmode;

        animation.onfinish = () => {
            try {
                if (commit) animation.commitStyles();
            } finally {
                animation.cancel();
                this.advance();
                onEnded?.();
            }
        };

        if (this.active && blendmode === 'none') {
            animation.pause();
            this.queue.push(animation);
        } else {
            this.animations.push(animation);
            if (blendmode === 'none') this.active++;
        }

        return config.duration + config.delay; // what to return if queued?
    }

    advance() {
        if (--this.active > 0) return;

        this.animations = this.animations.filter(animation => animation.playState === 'running');
        this.animations.push(...this.queue.splice(0, 1));
        this.active = this.animations.filter(animation => animation.blendmode === 'none').length;
    }

    clear() {

    }

    toggle(paused: boolean) {
        this.animations.forEach(animation => animation[paused ? 'pause' : 'play']());
    }

}