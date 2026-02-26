import Clip, { ClipConfig } from "./clip2";
import { getParentAnimator, registerAnimator } from "./state";

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
    tracks: Map<Element, any> = new Map();
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
        this.tracks.set(element, {});
    }

    mount() {
        this.state = 'mounted';
    }

    dispose() {
        this.state = 'unmounting';
    }

    getInitial() {
        return {};
    }

    time(clip: Clip) {
        return clip.duration + (this.tracks.size - 1) * .1; // todo: stagger
    }

    play(animation: T, { reverseCascade = false, ...options }: AnimationOptions & {
        reverseCascade?: boolean;
    } = {}) {
        if (this.interrupted) return 0;

        const clip = this.clips[animation],
            duration = this.time(clip);

        const delay = this.cascade(clip, reverseCascade ? 0 : duration);

        return this.push(clip, {
            ...options,
            delay: reverseCascade ? delay : undefined // will override exisiting delay..
        });
    }

    cascade(clip: Clip, delay: number) {
        let elapsed = 0;

        // only use clip if no own clip is defined
        this.dependents.forEach(animator => elapsed = Math.max(elapsed, animator.play(clip, {
            delay // will override exisiting delay..
        })));

        return elapsed;
    }

    push(clip: Clip, options: AnimationOptions) {
        this.tracks.forEach(track => {

        });

        return 0;
    }

    pause() {

    }

    stop() {

    }

}