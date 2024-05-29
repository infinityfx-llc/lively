'use client';

import { Children, cloneElement, createContext, isValidElement, useCallback, useEffect, useImperativeHandle, useRef, use, useMemo } from "react";
import Clip, { AnimatableInitials, ClipProperties } from "./core/clip";
import { Trigger } from "./hooks/use-trigger";
import Timeline, { PlayOptions } from "./core/timeline";
import { combineRefs, merge, pick } from "./core/utils";
import { CachableKey } from "./core/cache";
import useMountEffect from "./hooks/use-mount-effect";

type StaticTrigger = 'mount' | 'unmount';

export type AnimatableType<T extends string = any> = {
    play: (animation: T | 'animate', options?: PlayOptions, layer?: number) => number;
    trigger: (trigger: StaticTrigger, options?: PlayOptions) => number;
    timeline: Timeline;
    children: React.RefObject<AnimatableType | null>[];
    inherit: boolean | undefined;
    adaptive: boolean;
    manual: boolean;
    id: string;
};

type SharedProps<T extends string = any> = {
    group?: string;
    animations?: { [key in T]: ClipProperties | Clip; };
    triggers?: ({ name?: T | 'animate'; on: Trigger | boolean | StaticTrigger; } & PlayOptions)[];
    animate?: ClipProperties | Clip;
    initial?: AnimatableInitials;
    stagger?: number;
    staggerLimit?: number;
    deform?: boolean;
    disabled?: boolean;
    paused?: boolean;
}

export type AnimatableProps<T extends string = any> = {
    ref?: React.Ref<AnimatableType>;
    children: React.ReactNode;
    id?: string;
    order?: number;
    inherit?: boolean;
    passthrough?: boolean;
    adaptive?: boolean;
    cachable?: CachableKey[];
    manual?: boolean;
    onAnimationEnd?: (animation: T | 'animate') => void;
} & SharedProps<T>;

type AnimatableContext = {
    index?: number;
    add: (child: React.RefObject<AnimatableType | null>) => void;
    remove: (child: React.RefObject<AnimatableType | null>) => void;
} & SharedProps;

export const AnimatableContext = createContext<null | AnimatableContext>(null);

export default function Animatable<T extends string>(props: AnimatableProps<T>) {
    const self = useRef<AnimatableType<T>>(null);
    const children = useRef<React.RefObject<AnimatableType | null>[]>([]);
    const parent = use(AnimatableContext);

    const mergedProps = props.inherit && parent ? merge({}, props, pick(parent, ['group', 'animations', 'triggers', 'animate', 'initial', 'stagger', 'staggerLimit', 'deform', 'disabled', 'paused'])) : props;
    const {
        id = '',
        inherit,
        triggers = [],
        disabled,
        adaptive = false,
        manual = false,
        paused
    } = mergedProps;

    const index = props.order !== undefined ? props.order : (inherit && parent?.index || 0) + 1;
    const triggersState = useRef<(number | boolean)[]>([]);

    const clipMap = useMemo(() => {
        const map: { [key: string]: Clip; } = { animate: Clip.from(mergedProps.animate, mergedProps.initial) };

        for (const name in mergedProps.animations) {
            map[name] = Clip.from(mergedProps.animations[name], mergedProps.initial);
        }

        return map;
    }, []);

    const timeline = useRef(new Timeline({
        ...mergedProps,
        mountClips: triggers.reduce<Clip[]>((clips, { name, on }) => {
            if (on === 'mount') clips.push(clipMap[name || 'animate']);

            return clips;
        }, [])
    }));

    const play = useCallback((animation: T | 'animate', options: PlayOptions = {}, layer = 1) => {
        const clip = clipMap[animation];
        if (disabled || (index > 1 && layer < 2)) return 0;

        merge(options, { reverse: clip?.reverse }); // optimize syntax?
        let cascadeDelay = 0,
            layerDelay = (options.delay || 0),
            duration = clip ? timeline.current.time(clip) : 0;

        for (const child of children.current) {
            if (!child.current?.inherit) continue;

            cascadeDelay = Math.max(
                child.current.play(animation, merge({
                    delay: layerDelay + duration
                }, options), layer + 1),
                cascadeDelay
            );
        }

        const delay = (options.reverse ? cascadeDelay : layerDelay) * (index / layer);
        if (clip) timeline.current.add(clip, merge({ delay }, options));

        if (props.onAnimationEnd) setTimeout(props.onAnimationEnd.bind({}, animation), (duration + delay) * 1000);

        return duration + delay;
    }, [disabled, index]);

    function trigger(trigger: StaticTrigger, options: PlayOptions = {}) {
        let duration = 0;

        for (const { name, on, ...config } of triggers) {
            if (on !== trigger) continue;

            // when cascading to children dont use parent animation name, but infer from triggers of children
            duration = Math.max(play(name || 'animate', merge(config, options)), duration);
        }

        return duration;
    }

    useImperativeHandle(combineRefs(self, props.ref), () => ({
        play,
        trigger,
        timeline: timeline.current,
        children: children.current,
        inherit,
        adaptive,
        manual,
        id
    }), [triggers]);

    useEffect(() => timeline.current.pause(!!(paused || disabled)), [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < triggers.length; i++) {
            let { name, on, ...options } = triggers[i];

            if (typeof on === 'string') continue;

            const value = typeof on === 'boolean' ? on : on.called, prev = triggersState.current[i];
            if (prev !== undefined && value && value !== prev) play(name || 'animate', options);

            triggersState.current[i] = value;
        }
    }, [triggers]);

    useMountEffect(() => {
        const cache = () => timeline.current.cache(); // maybe dont do this mid transition (also transition on resize within layoutgroup)

        timeline.current.link(mergedProps.animate);
        window.addEventListener('resize', cache);

        parent?.add(self);

        document.fonts.ready.then(() => {
            if (!manual && !timeline.current.mounted) trigger('mount');
            timeline.current.mounted = true;
        });

        return () => {
            window.removeEventListener('resize', cache);

            timeline.current.unlink();
            parent?.remove(self);
        }
    }, []);

    return <AnimatableContext value={{
        ...(props.passthrough ? parent : { index, ...mergedProps }),
        add: (child: React.RefObject<AnimatableType | null>) => {
            if (props.passthrough) parent?.add(child);
            if (!children.current.includes(child)) children.current.push(child);
        },
        remove: (child: React.RefObject<AnimatableType | null>) => {
            if (props.passthrough) parent?.remove(child);
            const i = children.current.indexOf(child) || -1;

            if (i >= 0) children.current.splice(i, 1);
        }
    }}>
        {Children.map(props.children, child => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<any>, {
                ref: combineRefs(el => timeline.current.insert(el), (child as any).ref),
                pathLength: 1,
                style: merge(
                    {
                        backfaceVisibility: 'hidden',
                        willChange: 'transform'
                    },
                    (child as any).props.style,
                    clipMap.animate.initial,
                    {
                        strokeDasharray: 1
                    }
                ),
                'data-lively-offset-boundary': (['x', 'y'] as const).some(key => props.cachable?.includes(key)) || props.cachable === undefined ? true : undefined
            });
        })}
    </AnimatableContext>;
}

Animatable.isLively = true;