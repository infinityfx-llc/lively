import Lively from './main';
import Timeline from './timeline';

export default class AnimationManager {

    constructor(stagger, useCulling) {
        this.targets = [];

        this.stagger = stagger;
        this.useCulling = useCulling;
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
        this.targets = elements.map(el => new Timeline(el, this.useCulling));
    }

    play(clip, options) {
        for (let i = 0; i < this.targets.length; i++) {
            options.delay = (options.delay || 0) + i * this.stagger;

            if (clip.isEmpty) continue;
            this.targets[i].add(clip.play(options), options);
        }
    }

    initialize(clip) {
        for (const target of this.targets) target.initialize(clip);

        // init reactive values here
    }

    step(dt) {
        for (const target of this.targets) target.step(dt);
    }

}