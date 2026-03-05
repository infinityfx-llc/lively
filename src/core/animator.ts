import Clip, { ClipConfig, ClipInitials } from "./clip2";
import { getParentAnimator, isRegistered, registerAnimator, unregisterAnimator } from "./state";
import Track, { CacheKey } from "./track2";

export type LifeCycleTrigger = 'mount' | 'unmount';

export type AnimationTrigger = LifeCycleTrigger | boolean | number;

export type AnimationOptions = Omit<ClipConfig, 'duration' | 'easing'> & {
    override?: boolean;
    commit?: boolean;
    tag?: string;
};

export type AnimatorEvent = 'animationend' | 'transition' | 'unmount';

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
    ignoreScaleDeformation: boolean;
    cache: CacheKey[];
    stagger: number;
    staggerLimit: number;
    initialStyles: ClipInitials | null = null;
    eventListeners: {
        [key in AnimatorEvent]?: Set<(...args: any) => void>;
    } = {};
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';
    paused = false;
    frame = 0;

    constructor({ id, clips, lifeCycleAnimations, ignoreScaleDeformation, cache, stagger, staggerLimit }: {
        id: string;
        clips: {
            [key in T]: Clip;
        };
        lifeCycleAnimations: {
            [key in LifeCycleTrigger]?: T[];
        };
        ignoreScaleDeformation: boolean;
        cache: CacheKey[];
        stagger: number;
        staggerLimit: number;
    }) {
        this.id = id;
        this.clips = clips;
        this.lifeCycleAnimations = lifeCycleAnimations;
        this.ignoreScaleDeformation = ignoreScaleDeformation;
        this.cache = cache;
        this.stagger = stagger;
        this.staggerLimit = staggerLimit;
    }

    register(parentId: string, inherit: boolean | number) {
        if (isRegistered(this.id)) return;

        registerAnimator(this.id, this);

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) this.parent.dependents.add(this);
    }

    dispose() {
        cancelAnimationFrame(this.frame);
        unregisterAnimator(this.id);
        if (this.parent) this.parent.dependents.delete(this);
    }

    on<K extends (...args: any) => void>(event: AnimatorEvent, callback: K) {
        if (!(event in this.eventListeners)) this.eventListeners[event] = new Set();

        this.eventListeners[event]!.add(callback);
    }

    off<K extends (...args: any) => void>(event: AnimatorEvent, callback: K) {
        this.eventListeners[event]?.delete(callback);
    }

    dispatch(event: AnimatorEvent, ...args: any) {
        this.eventListeners[event]?.forEach(callback => callback(...args));
    }

    mount() {
        if (this.state === 'unmounted') this.trigger('mount');

        this.state = 'mounted';

        cancelAnimationFrame(this.frame);
        this.tick();
    }

    tick() {
        if (!this.paused) this.trackList.forEach(track => {
            if (!this.ignoreScaleDeformation) track.correct();
        });

        this.frame = requestAnimationFrame(this.tick.bind(this));
    }

    addTrack(element: any, index: number) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement) || this.tracks.has(element)) return;

        const track = new Track(element, this.cache),
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

        if (animations) animations.forEach(animation => elapsed = Math.max(this.play(animation, options), elapsed));

        return elapsed;
    }

    play(animation: T | Clip, { cascade = 'forward', delay = 0, tag, ...options }: AnimationOptions & {
        cascade?: 'forward' | 'reverse'; // add to base AnimationOptions type?
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
            // cascade other props to animator here

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
            }, i === this.tracks.size ? () => this.dispatch('animationend', tag) : undefined);

            elapsed = Math.max(elapsed, added);
        }

        return elapsed;
    }

    transition() {
        if (this.state !== 'mounted') return;

        this.trackList.forEach(track => track.transition());
        this.dispatch('transition');
    }

    togglePlayState(paused: boolean) {
        this.trackList.forEach(track => track.toggle(paused));
        this.paused = paused;

        // should cascade to children?
    }

    stop() {
        // stop only specific animation?
        this.trackList.forEach(track => track.clear());
    }

}