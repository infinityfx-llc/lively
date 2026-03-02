import Clip, { ClipConfig, ClipInitials } from "./clip2";
import { getParentAnimator, registerAnimator, unregisterAnimator } from "./state";
import Track from "./track2";

export type LifeCycleTrigger = 'mount' | 'unmount';

export type AnimationTrigger = LifeCycleTrigger | boolean | number;

export type AnimationOptions = Omit<ClipConfig, 'duration' | 'easing'> & {
    override?: boolean;
    commit?: boolean;
    tag?: string;
};

export type AnimationEvent = 'end'; // add more

export default class Animator<T extends string> {

    id: string;
    parent: Animator<any> | null = null;
    dependents: Set<Animator<any>> = new Set();
    clips: {
        [key in T]: Clip;
    };
    lifeCycleAnimations: {
        [key in LifeCycleTrigger]?: T[];
    };
    tracks: Set<Element> = new Set();
    trackList: Track[] = [];
    stagger: number;
    staggerLimit: number;
    initialStyles: ClipInitials | null = null;
    eventListeners: {
        [key in AnimationEvent]?: Set<(...args: any) => void>;
    } = {};
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';
    paused = false;
    frame = 0;

    constructor({ id, parentId, inherit, clips, lifeCycleAnimations, stagger = 0.07, staggerLimit = 10 }: {
        id: string;
        parentId: string;
        inherit: boolean | number;
        clips: {
            [key in T]: Clip;
        };
        lifeCycleAnimations: {
            [key in LifeCycleTrigger]?: T[];
        }
        stagger?: number;
        staggerLimit?: number;
    }) {
        this.id = registerAnimator(id, this);
        this.clips = clips;
        this.lifeCycleAnimations = lifeCycleAnimations;
        this.stagger = stagger;
        this.staggerLimit = staggerLimit;

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) this.parent.dependents.add(this);
    }

    on<K extends (...args: any) => void>(event: AnimationEvent, callback: K) {
        if (!(event in this.eventListeners)) this.eventListeners[event] = new Set();

        this.eventListeners[event]!.add(callback);
    }

    off<K extends (...args: any) => void>(event: AnimationEvent, callback: K) {
        this.eventListeners[event]?.delete(callback);
    }

    dispatch(event: AnimationEvent, ...args: any) {
        this.eventListeners[event]?.forEach(callback => callback(...args));
    }

    mount() {
        if (this.state === 'unmounted') this.trigger('mount');

        this.state = 'mounted';
        this.tick();
    }

    dispose() {
        this.state = 'unmounting';

        cancelAnimationFrame(this.frame);
        unregisterAnimator(this.id);
        if (this.parent) this.parent.dependents.delete(this);
    }

    tick() {
        if (!this.paused) this.trackList.forEach(track => track.correct()); // only if should not deform

        this.frame = requestAnimationFrame(this.tick.bind(this));
    }

    addTrack(element: any, index: number) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement) || this.tracks.has(element)) return;

        const track = new Track(element),
            animations = this.lifeCycleAnimations['mount'];

        this.tracks.add(element);
        this.trackList.splice(index, 0, track);

        if (this.state === 'mounted' && animations) animations.forEach(animation => track.push(this.clips[animation]));
    }

    mergeInitialStyles(styles: ClipInitials): ClipInitials {
        if (this.initialStyles) return this.initialStyles;

        const animations = this.lifeCycleAnimations.mount || [],
            clips = animations.map(animation => this.clips[animation]);

        if (clips.length) {
            styles = Clip.mergeInitialStyles(clips, styles);
        } else
            if (this.parent) {
                styles = this.parent.mergeInitialStyles(styles);
            }

        return this.initialStyles = styles;
    }

    pretime(clip: Clip, options: AnimationOptions) {
        const { duration, delay, iterations } = clip.getConfig(options);
        return duration * iterations + delay + Math.max(Math.min(this.tracks.size, this.staggerLimit) - 1, 0) * this.stagger;
    }

    trigger(on: LifeCycleTrigger, options: AnimationOptions = {}) {
        let animations = this.lifeCycleAnimations[on],
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
            duration = this.pretime(clip, options);

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
        let elapsed = 0, i = 0;
        if (clip.isEmpty) return 0;

        while (i < this.tracks.size) {
            const track = this.trackList[i];

            if (!track.element.isConnected) {
                this.tracks.delete(track.element);
                this.trackList.splice(i, 1);
                continue;
            }

            if (override) track.clear();

            const added = track.push(clip, {
                ...options,
                delay: delay + Math.min(i++, this.staggerLimit - 1) * this.stagger
            }, i === this.tracks.size ? () => this.dispatch('end', tag) : undefined);

            elapsed = Math.max(elapsed, added);
        }

        return elapsed;
    }

    pause() {
        // also need play method
        this.trackList.forEach(track => track.toggle(true));
        this.paused = true;

        // should cascade to children?
    }

    stop() {
        // stop only specific animation?
        this.trackList.forEach(track => track.clear());
    }

}