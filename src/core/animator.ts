import AnimationLink, { TransitionOptions } from "./animation-link";
import Clip, { ClipConfig, ClipInitials, ClipKey, ClipOptions } from "./clip";
import { deleteMorphTarget, getParentAnimator, registerAnimator, registerAsMorph, unregisterAnimator } from "./state";
import Track, { CacheKey, CorrectionAlignment } from "./track";
import { extractAnimationLinks } from "./utils";

export type LifeCycleTrigger = 'mount' | 'unmount';

export type AnimationTrigger = LifeCycleTrigger | boolean | number;

export type AnimationOptions = Omit<ClipConfig, 'duration' | 'easing'> & {
    cascade?: 'forward' | 'reverse';
    override?: boolean;
    commit?: boolean;
    tag?: string;
};

export type ScaleCorrection = 'none' | 'partial' | 'all';

export type AnimatorEvent = 'animationend' | 'transitionstart' | 'unmount';

export default class Animator<T extends string> {

    id: string;
    parent: Animator<any> | null = null;
    dependents: Set<Animator<any>> = new Set();
    inherit: ('correction' | 'defaultTransitionOptions' | 'cache' | 'align')[] = [];
    clips: {
        [key in T]: Clip;
    };
    lifeCycleAnimations: {
        [key in LifeCycleTrigger]?: [T, AnimationOptions][];
    };
    links: {
        [key in ClipKey]?: AnimationLink<any>;
    } = {};
    onDisposeLinks: (() => void) | null = null;
    tracks: Set<Element> = new Set();
    trackList: Track[] = [];
    correction: ScaleCorrection;
    defaultTransitionOptions: TransitionOptions;
    cache: CacheKey[];
    align: CorrectionAlignment;
    stagger: number;
    staggerLimit: number;
    initialStyles: {
        mounted?: ClipInitials;
        unmounted?: ClipInitials;
    } = {};
    eventListeners: {
        [key in AnimatorEvent]?: Set<(...args: any) => void>;
    } = {};
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';
    delayUnmountUntil = 0;
    isMounting = true;
    paused = false;
    timeout = 0;
    frame = 0;

    constructor({ id, clips, lifeCycleAnimations, correction, transition, stagger, staggerLimit, morph }: {
        id: string;
        clips: {
            [key in T]: Clip;
        };
        lifeCycleAnimations: {
            [key in LifeCycleTrigger]?: [T, AnimationOptions][];
        };
        correction?: CorrectionAlignment | ScaleCorrection;
        transition?: (TransitionOptions & {
            cache?: CacheKey[];
        }) | boolean;
        stagger: number;
        staggerLimit: number;
        morph?: string;
    }) {
        const { cache, ...options } = typeof transition === 'object' ? transition : {
            cache: transition === true || morph ? undefined : []
        };

        this.id = id;
        this.clips = clips;
        this.lifeCycleAnimations = lifeCycleAnimations;
        this.correction = typeof correction === 'string' ? correction :
            (correction ? 'all' : 'partial');
        this.defaultTransitionOptions = options;
        this.cache = cache || ['x', 'y', 'sx', 'sy', 'rotate', 'borderRadius'];
        this.align = typeof correction === 'object' ? correction : { x: 'left', y: 'top' };
        this.stagger = stagger;
        this.staggerLimit = staggerLimit;

        if (correction === undefined) this.inherit.push('correction');
        if (correction === undefined) this.inherit.push('align');
        if (!transition) this.inherit.push('defaultTransitionOptions');
        if (!cache) this.inherit.push('cache');
    }

    register(parentId: string, inherit: boolean | number, morph?: string) {
        clearTimeout(this.timeout);
        registerAnimator(this.id, this);
        if (morph) registerAsMorph(morph, this.id);

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) {
            this.parent.dependents.add(this);

            // @ts-expect-error
            for (const key of this.inherit) this[key] = this.parent[key];
        }
    }

    mount() {
        if (this.state === 'unmounted') this.trigger('mount');

        this.state = 'mounted';

        cancelAnimationFrame(this.frame);
        this.tick();
    }

    dispose(morph?: string) {
        this.onDisposeLinks?.();
        cancelAnimationFrame(this.frame);

        this.trackList.forEach(track => track.cache = track.snapshot());
        this.state = 'unmounted';
        this.stop();

        this.timeout = setTimeout(() => {
            unregisterAnimator(this.id);
            if (morph) deleteMorphTarget(morph, this.id);
            if (this.parent) this.parent.dependents.delete(this);
        }, 1);
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

    tick() {
        if (!this.paused) this.trackList.forEach(track => {
            track.correct(this.correction);
        });

        this.frame = requestAnimationFrame(this.tick.bind(this));
    }

    addLinks(animate: Clip | ClipOptions) {
        const [links, disposeLinks] = extractAnimationLinks(animate, (key, link) => {
            this.forEachTrack((track, i) => {
                const clip = new Clip({
                    ...link.options,
                    composite: 'override',
                    [key]: link.get(i)
                });

                track.push(clip);
            });
        });

        this.links = links;
        this.onDisposeLinks = disposeLinks;
    }

    addTrack(element: any, index: number) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement) || this.tracks.has(element)) return;

        const track = new Track(element, this.cache, this.align),
            animations = this.lifeCycleAnimations['mount'];

        track.correct(this.correction);

        this.tracks.add(element);
        this.trackList.splice(index, 0, track);

        if (this.state === 'mounted' && animations) animations.forEach(([name, options]) => track.push(this.clips[name], options)); // instead of this.clips use this.getClip()? (able to get parent clip)
        // ^ would also need to cascade lifeCycleAnimations?
    }

    mergeInitialStyles(styles: ClipInitials, mode: 'mounted' | 'unmounted'): ClipInitials {
        if (mode in this.initialStyles) return this.initialStyles[mode]!;

        const reversed = mode === 'mounted';
        const clips = (this.lifeCycleAnimations.mount || [])
            .map(([name, options]) => [this.clips[name], (options.reverse || false) !== reversed] as const)
            .filter(([clip]) => !clip.isEmpty);

        if (clips.length) {
            const merged = {
                backfaceVisibility: 'hidden',
                willChange: 'transform'
            };

            for (const [clip, reversed] of clips) {
                const index = reversed !== clip.reverse ? clip.keyframes.length - 1 : 0;
                const { offset, ...styles } = clip.keyframes[index];

                Object.assign(merged, styles);
            }

            styles = Object.assign(merged, styles);
        } else
            if (this.parent) {
                styles = this.parent.mergeInitialStyles(styles, mode);
            }

        return this.initialStyles[mode] = styles;
    }

    setInitialStyles(styles: ClipInitials, mode: 'mounted' | 'unmounted') {
        styles = this.mergeInitialStyles(styles, mode);

        this.trackList.forEach(track => {
            for (const key in styles) {
                // @ts-expect-error
                track.element.style[key] = styles[key];
            }

            if (mode === 'unmounted') track.clear(); // testing
        });
    }

    pretime(clip: Clip, options: AnimationOptions) {
        if (clip.isEmpty) return 0;

        const { duration, delay, iterations } = clip.getConfig(options);
        return (duration * iterations + delay) / 1000 + Math.max(Math.min(this.tracks.size, this.staggerLimit) - 1, 0) * this.stagger;
    }

    trigger(on: LifeCycleTrigger, options: AnimationOptions = {}) {
        let animations = this.lifeCycleAnimations[on],
            elapsed = 0;

        if (animations) animations.forEach(([name, opts]) => elapsed = Math.max(this.play(name, Object.assign(opts, options)), elapsed));

        return elapsed;
    }

    play(animation: T | Clip, { cascade = 'forward', delay = 0, tag, ...options }: AnimationOptions = {}) {
        if (this.paused || (this.parent && !tag)) return 0;

        let clip = typeof animation === 'string' ? this.clips[animation] : animation;
        if (tag && tag in this.clips) clip = this.clips[tag as T];
        if (!tag && typeof animation === 'string') tag = animation;

        const duration = this.pretime(clip, options);
        const cascadeDelay = this.cascade(clip, {
            ...options,
            delay: cascade === 'reverse' ? delay : duration + delay,
            tag
        });

        return this.push(clip, {
            ...options,
            delay: cascade === 'reverse' ? cascadeDelay + delay : delay,
            tag
        });
    }

    cascade(clip: Clip, options: AnimationOptions) {
        let elapsed = 0;

        this.dependents.forEach(animator => {
            elapsed = Math.max(elapsed, animator.play(clip, options));
        });

        return elapsed;
    }

    forEachTrack(callback: (track: Track, index: number) => void) {
        let i = 0;

        while (i < this.tracks.size) {
            const track = this.trackList[i];

            if (!track.element.isConnected) {
                this.tracks.delete(track.element);
                this.trackList.splice(i, 1);
                continue;
            }

            callback(track, i++);
        }
    }

    push(clip: Clip, { override, delay = 0, tag, ...options }: AnimationOptions) {
        if (clip.isEmpty) return 0;

        let elapsed = 0;
        this.forEachTrack((track, i) => {
            if (override) track.clear();

            const added = track.push(clip, {
                ...options,
                delay: delay + Math.min(i, this.staggerLimit - 1) * this.stagger
            }, i === this.tracks.size - 1 ? () => this.dispatch('animationend', tag) : undefined);

            elapsed = Math.max(elapsed, added);
        });

        return elapsed;
    }

    transition(from?: Animator<any>, options: TransitionOptions = this.defaultTransitionOptions) {
        if (this.paused || !this.cache.length) return;

        this.trackList.forEach((track, i) => {
            const { cache } = from && i < from.tracks.size ? from.trackList[i] : {};

            track.transition(cache, options);
        });

        this.dispatch('transitionstart');
    }

    setPlayState(paused: boolean) {
        this.trackList.forEach(track => track.toggle(paused));
        this.paused = paused;

        this.dependents.forEach(animator => animator.setPlayState(paused));
    }

    stop(animation?: T) {
        this.trackList.forEach(track => track.clear(animation));
    }

}