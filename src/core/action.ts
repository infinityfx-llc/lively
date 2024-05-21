import type { CompositeType, DynamicProperties } from "./clip";
import type Track from "./track";

export default class Action {

    composite: CompositeType;
    commit: boolean = true;
    track: Track;
    animation: Animation;
    dynamic: DynamicProperties;
    onfinish: (() => void) | null = null;

    constructor(track: Track, keyframes: Keyframe[] | PropertyIndexedKeyframes, config: Omit<KeyframeAnimationOptions, 'composite'> & { composite: CompositeType; }, dynamic: DynamicProperties = {}) {
        this.composite = config.composite;
        (config as any).composite = config.composite === 'combine' ? 'accumulate' : 'replace';
        this.animation = track.element.animate(keyframes, config as any as KeyframeAnimationOptions);
        this.dynamic = dynamic;
        this.track = track;

        this.animation.onfinish = this.finish.bind(this);
    }

    finish() {
        try {
            if (this.commit) this.animation.commitStyles();
        } catch (ex) {}
        this.animation.cancel();

        this.onfinish?.();
    }

    step(index: number) {
        if (this.animation.playState === 'paused') return;

        const progress = this.animation.effect?.getComputedTiming().progress || 0;

        for (const prop in this.dynamic) {
            const val = this.dynamic[prop as keyof DynamicProperties]?.(progress, index);

            this.track.apply(prop, val);
        }
    }

}