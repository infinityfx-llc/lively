import type { DynamicProperties } from "./clip";
import type Track from "./track";

export type ActionKeyframes = { keyframes: Keyframe[] | PropertyIndexedKeyframes; config?: KeyframeAnimationOptions; dynamic?: DynamicProperties };

export default class Action {

    track: Track;
    animations: Animation[];
    dynamic: DynamicProperties = {};
    paused: boolean = false;
    onfinish: (() => void) | null = null;

    constructor(track: Track, keyframes: ActionKeyframes | ActionKeyframes[]) {
        if (!Array.isArray(keyframes)) keyframes = [keyframes];

        this.track = track;
        this.animations = keyframes.map(({ keyframes, config, dynamic }) => {
            if (dynamic) this.dynamic = dynamic;

            return track.element.animate(keyframes, config);
        });

        this.animations[0].onfinish = this.finish.bind(this);
    }

    finish() {
        for (const animation of this.animations) {
            if (this.track.element.offsetParent !== null) animation.commitStyles();
            animation.cancel();
        }

        this.onfinish?.();
    }

    step(index: number) {
        if (this.paused) return;

        const progress = this.animations[0].effect?.getComputedTiming().progress || 0;

        for (const prop in this.dynamic) {
            const val = this.dynamic[prop as keyof DynamicProperties]?.(progress, index);

            this.track.set(prop, val);
        }

        this.track.correct();
    }

    play() {
        this.animations.forEach(animation => animation.play());
        this.paused = false;
    }

    pause() {
        this.animations.forEach(animation => animation.pause());
        this.paused = true;
    }

    remove() {
        this.animations.forEach(animation => animation.cancel());
    }

}