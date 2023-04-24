import type { DynamicProperties } from "./clip";
import type Track from "./track";

export default class Action {

    composited: boolean;
    track: Track;
    animation: Animation;
    dynamic: DynamicProperties;
    onfinish: (() => void) | null = null;

    constructor(track: Track, keyframes: Keyframe[] | PropertyIndexedKeyframes, config: KeyframeAnimationOptions, dynamic: DynamicProperties = {}) {
        this.track = track;
        this.animation = track.element.animate(keyframes, config);
        this.dynamic = dynamic;

        this.composited = config.composite === 'accumulate';
        this.animation.onfinish = this.finish.bind(this);
    }

    finish() {
        if (this.track.element.isConnected) this.animation.commitStyles();
        this.animation.cancel();

        this.onfinish?.();
    }

    step(index: number) {
        if (this.animation.playState === 'paused') return;

        const progress = this.animation.effect?.getComputedTiming().progress || 0;

        for (const prop in this.dynamic) {
            const val = this.dynamic[prop as keyof DynamicProperties]?.(progress, index);

            this.track.set(prop, val);
        }
    }

}