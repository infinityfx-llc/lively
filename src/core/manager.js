import Lively from './main';
import Timeline from './timeline';

export default class AnimationManager {

    constructor({ priority = 0, stagger = 0.1, culling = true, noDeform = false, paused = false }) {
        this.targets = [];

        this.priority = priority;
        this.stagger = stagger;
        this.culling = culling;
        this.noDeform = noDeform;
        this.paused = paused;
    }

    register() {
        Lively.get().add(this);
    }

    destroy() {
        this.targets = [];

        Lively.get().remove(this);
    }

    purge() {
        for (const target of this.targets) target.purge();
    }

    clear() {
        for (const target of this.targets) target.clear();
    }

    set(elements) {
        this.targets = elements.map(el => new Timeline(el, this.culling, this.noDeform));
    }

    play(clip, options) {
        if (clip.isEmpty) return;

        for (let i = 0; i < this.targets.length; i++) {
            const config = {
                ...options,
                delay: (options.delay || 0) + i * this.stagger
            };
            if (i < this.targets.length - 1) config.callback = null;

            this.targets[i].add(clip.play(config), options);
        }
    }

    initialize(clip) {
        for (const target of this.targets) target.initialize(clip);
    }

    step(dt) {
        if (this.paused) return;

        for (const target of this.targets) target.step(dt);
    }

}