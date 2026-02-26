import Clip, { ClipConfig } from "./clip2";
import { getParentAnimator, registerAnimator } from "./state";
import Track from "./track2";

export type AnimationOptions = Omit<ClipConfig, 'duration' | 'easing'> & {
    override?: boolean;
    commit?: boolean;
    // tag?: (for passing animation name?)
};

export default class Animator<T extends string> {

    id: string;
    parent: Animator<any> | null = null;
    dependents: Set<Animator<any>> = new Set();
    clips: {
        [key in T]: Clip;
    };
    triggers: {
        [key in 'mount']?: T[];
    };
    tracks: Map<Element, Track> = new Map();
    stagger: number;
    staggerLimit: number;
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';
    interrupted = false;

    constructor({ id, parentId, inherit, clips, stagger = 0.07, staggerLimit = 10 }: {
        id: string;
        parentId: string;
        inherit: boolean | number;
        clips: {
            [key in T]: Clip;
        };
        stagger?: number;
        staggerLimit?: number;
    }) {
        this.id = registerAnimator(id, this);
        this.clips = clips;
        this.triggers = {}; // todo
        this.stagger = stagger;
        this.staggerLimit = staggerLimit;

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) this.parent.addDependent(this);
    }

    addDependent(animator: Animator<any>) {
        this.dependents.add(animator);
    }

    addTrack(element: any, index: number) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement)) return;

        // somehow keep staggering ordering
        this.tracks.set(element, new Track(element));
    }

    mount() {
        this.state = 'mounted';
    }

    dispose() {
        this.state = 'unmounting';
    }

    getInitialStyles() {
        return {};
    }

    time(clip: Clip) {
        // take into account AnimationOptions?
        // also repeat count?
        return clip.duration + clip.delay + Math.max(Math.min(this.tracks.size, this.staggerLimit) - 1, 0) * this.stagger;
    }

    trigger(on: 'mount', options: AnimationOptions = {}) {
        let animations = this.triggers[on],
            elapsed = 0;

        if (animations) animations.forEach(animation => Math.max(this.play(animation, options), elapsed));

        return elapsed;
    }

    play(animation: T | Clip, { reverseCascade = false, delay = 0, ...options }: AnimationOptions & {
        reverseCascade?: boolean;
    } = {}) {
        if (this.interrupted) return 0;
        // ^ don't allow to play when inherits from parent?

        const clip = animation instanceof Clip ? animation : this.clips[animation],
            duration = this.time(clip);

        const cascadeDelay = this.cascade(animation, clip, {
            ...options,
            delay: reverseCascade ? delay : duration + delay
        });

        return this.push(clip, {
            ...options,
            delay: reverseCascade ? cascadeDelay + delay : delay
        });
    }

    cascade(animation: T | Clip, clip: Clip, options: AnimationOptions) {
        let elapsed = 0;

        // only use clip if no own clip is defined
        this.dependents.forEach(animator => {
            elapsed = Math.max(elapsed, animator.play(clip, options));
        });

        return elapsed;
    }

    push(clip: Clip, { override, ...options }: AnimationOptions) {
        let elapsed = 0,
            track: Track | undefined,
            tracks = this.tracks.values();
        if (clip.isEmpty) return 0;

        while (track = tracks.next().value) {
            if (!track.element.isConnected) {
                this.tracks.delete(track.element);
                continue;
            }

            if (override) track.clear();

            const added = track.push(clip, {
                ...options,
                delay: 0 // todo: stagger delay
            }, () => {
                // todo: if last track call onAnimationEnd
                // need animation name for this..
            });

            elapsed = Math.max(elapsed, added);
        }

        return elapsed;
    }

    pause() {
        // also need play method
        this.tracks.forEach(track => track.toggle(true));
    }

    stop() {
        // stop only specific animation?
        this.tracks.forEach(track => track.clear());
    }

}