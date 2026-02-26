import Clip, { ClipConfig } from "./clip2";
import { getParentAnimator, registerAnimator } from "./state";
import Track from "./track2";

export type AnimationOptions = Omit<ClipConfig, 'duration' | 'easing'> & {
    override?: boolean;
    commit?: boolean;
};

export default class Animator<T extends string = any> {

    id: string;
    parent: Animator | null = null;
    dependents: Set<Animator> = new Set();
    clips: {
        [key in T]: Clip;
    };
    tracks: Map<Element, Track> = new Map();
    stagger: number = 0.07;
    staggerLimit: number = 10;
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';
    interrupted = false;

    constructor({ id, parentId, inherit, clips }: {
        id: string;
        parentId: string;
        inherit: boolean | number;
        clips: {
            [key in T]: Clip;
        };
    }) {
        this.id = registerAnimator(id, this);
        this.clips = clips;

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) this.parent.addDependent(this);
    }

    addDependent(animator: Animator) {
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
        return clip.duration + clip.delay + Math.max(Math.min(this.tracks.size - 1, this.staggerLimit), 0) * this.stagger;
    }

    play(animation: T, { reverseCascade = false, ...options }: AnimationOptions & {
        reverseCascade?: boolean;
    } = {}) {
        if (this.interrupted) return 0;

        const clip = this.clips[animation],
            duration = this.time(clip);

        const delay = this.cascade(animation, clip, {
            ...options,
            delay: reverseCascade ? 0 : duration // will override exisiting delay..
        });

        return this.push(clip, {
            ...options,
            delay: reverseCascade ? delay : undefined // will override exisiting delay..
        });
    }

    cascade(animation: T, clip: Clip, options: AnimationOptions) {
        let elapsed = 0;

        // only use clip if no own clip is defined
        this.dependents.forEach(animator => {
            elapsed = Math.max(elapsed, animator.play(clip, options));
        });

        return elapsed;
    }

    push(clip: Clip, { override, ...options }: AnimationOptions) {
        let elapsed = 0;
        if (clip.isEmpty) return 0;

        this.tracks.forEach(track => {
            // check if track's element is still mounted?
            if (override) track.clear();

            const added = track.push(clip, {
                ...options,
                delay: 0 // todo: stagger delay
            });
            elapsed = Math.max(elapsed, added);

            if (true) track.onAnimationEnd(); // todo: if last track
        });

        return elapsed;
    }

    pause() {
        this.tracks.forEach(track => track.toggle(true));
    }

    stop() {

    }

}