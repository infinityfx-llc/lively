import Clip, { ClipConfig, ClipInitials } from "./clip2";
import { getParentAnimator, registerAnimator, unregisterAnimator } from "./state";
import Track from "./track2";

export type AnimationOptions = Omit<ClipConfig, 'duration' | 'easing'> & {
    override?: boolean;
    commit?: boolean;
    tag?: string;
};

export type AnimationEvent = 'end';

export default class Animator<T extends string> {

    id: string;
    parent: Animator<any> | null = null;
    dependents: Set<Animator<any>> = new Set();
    clips: {
        [key in T]: Clip;
    };
    lifecycleAnimations: {
        [key in 'mount' | 'unmount']?: T[];
    };
    tracks: Map<Element, Track> = new Map();
    stagger: number;
    staggerLimit: number;
    initialStyles: ClipInitials | null = null;
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';
    paused = false;

    constructor({ id, parentId, inherit, clips, lifeCycleAnimations, stagger = 0.07, staggerLimit = 10 }: {
        id: string;
        parentId: string;
        inherit: boolean | number;
        clips: {
            [key in T]: Clip;
        };
        lifeCycleAnimations: {
            [key in 'mount' | 'unmount']?: T[];
        }
        stagger?: number;
        staggerLimit?: number;
    }) {
        this.id = registerAnimator(id, this);
        this.clips = clips;
        this.lifecycleAnimations = lifeCycleAnimations;
        this.stagger = stagger;
        this.staggerLimit = staggerLimit;

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) this.parent.dependents.add(this);
    }

    on<K extends (...args: any) => void>(event: AnimationEvent, callback: K) {
        // todo
    }

    off<K extends (...args: any) => void>(event: AnimationEvent, callback: K) {
        // todo
    }

    dispatch(event: AnimationEvent, ...args: any) {
        // todo
    }

    addTrack(element: any, index: number) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement)) return;

        // somehow keep staggering ordering
        const track = new Track(element),
            animations = this.lifecycleAnimations['mount'];
        this.tracks.set(element, track);

        if (this.state === 'mounted' && animations) animations.forEach(animation => track.push(this.clips[animation]));
    }

    mount() {
        this.trigger('mount'); // don't do if already mounted? (skipInitialMount setting for LayoutGroup)

        this.state = 'mounted';
    }

    dispose() {
        this.state = 'unmounting';

        unregisterAnimator(this.id);
        if (this.parent) this.parent.dependents.delete(this);
    }

    mergeInitialStyles(styles: ClipInitials): ClipInitials {
        if (this.initialStyles) return this.initialStyles;

        const animations = this.lifecycleAnimations.mount || [],
            clips = animations.map(animation => this.clips[animation]);

        if (clips.length) {
            styles = Clip.mergeInitialStyles(clips, styles);
        } else
            if (this.parent) {
                styles = this.parent.mergeInitialStyles(styles);
            }

        return this.initialStyles = styles;
    }

    pretime(clip: Clip) {
        // take into account AnimationOptions?
        // also repeat count?
        return clip.duration + clip.delay + Math.max(Math.min(this.tracks.size, this.staggerLimit) - 1, 0) * this.stagger;
    }

    trigger(on: 'mount', options: AnimationOptions = {}) {
        let animations = this.lifecycleAnimations[on],
            elapsed = 0;

        if (animations) animations.forEach(animation => Math.max(this.play(animation, options), elapsed));

        return elapsed;
    }

    play(animation: T | Clip, { cascade = 'forward', delay = 0, tag, ...options }: AnimationOptions & {
        cascade?: 'forward' | 'reverse';
    } = {}) {
        if (this.paused || (this.parent && !tag)) return 0;

        // if (tag && tag in this.clips) clip = this.clips[tag as T]; // wip
        const clip = animation instanceof Clip ? animation : this.clips[animation],
            duration = this.pretime(clip);

        const cascadeDelay = this.cascade(clip, {
            ...options,
            delay: cascade === 'reverse' ? delay : duration + delay,
            tag: typeof animation === 'string' ? animation : tag
        });

        return this.push(clip, {
            ...options,
            delay: cascade === 'reverse' ? cascadeDelay + delay : delay,
            tag: typeof animation === 'string' ? animation : tag
        });
    }

    cascade(clip: Clip, options: AnimationOptions) {
        let elapsed = 0;

        this.dependents.forEach(animator => {
            elapsed = Math.max(elapsed, animator.play(clip, options));
        });

        return elapsed;
    }

    push(clip: Clip, { override, delay = 0, tag, ...options }: AnimationOptions) {
        let tracks = this.tracks.values(),
            elapsed = 0,
            i = 0;
        if (clip.isEmpty) return 0;

        while (true) {
            const { value: track, done } = tracks.next();
            if (!track) break;

            if (!track.element.isConnected) {
                this.tracks.delete(track.element);
                continue;
            }

            if (override) track.clear();

            const added = track.push(clip, {
                ...options,
                delay: delay + Math.min(i++, this.staggerLimit - 1) * this.stagger
            }, done ? () => this.dispatch('end', tag) : undefined);

            elapsed = Math.max(elapsed, added);
        }

        return elapsed;
    }

    pause() {
        // also need play method
        this.tracks.forEach(track => track.toggle(true));
        this.paused = true;

        // should cascade to children?
    }

    stop() {
        // stop only specific animation?
        this.tracks.forEach(track => track.clear());
    }

}