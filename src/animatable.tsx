'use client';

import { Children, cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Clip, { AnimatableInitials, ClipProperties } from "./core/clip";
import { Trigger } from "./hooks/use-trigger";
import Timeline, { PlayOptions } from "./core/timeline";
import { combineRefs, merge, pick } from "./core/utils";
import { CachableKey } from "./core/cache";

type StaticTrigger = 'mount' | 'unmount';

export type AnimatableType<T extends string = any> = {
    play: (animation: T | 'animate', options?: PlayOptions, layer?: number) => number;
    trigger: (trigger: StaticTrigger, options?: PlayOptions) => number;
    timeline: Timeline;
    children: React.MutableRefObject<AnimatableType | null>[];
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
    add: (child: React.RefObject<AnimatableType>) => void;
    remove: (child: React.RefObject<AnimatableType>) => void;
} & SharedProps;

export const AnimatableContext = createContext<null | AnimatableContext>(null);

function AnimatableBase<T extends string>(props: AnimatableProps<T>, ref: React.ForwardedRef<AnimatableType>) {
    const self = useRef<AnimatableType<T>>(null);
    const children = useRef<React.MutableRefObject<AnimatableType | null>[]>([]);
    const parent = useContext(AnimatableContext);

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

    const [clipMap] = useState(() => {
        const map: { [key: string]: Clip; } = { animate: Clip.from(mergedProps.animate, mergedProps.initial) };

        for (const name in mergedProps.animations) {
            map[name] = Clip.from(mergedProps.animations[name], mergedProps.initial);
        }

        return map;
    });

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

        merge(options, { reverse: clip?.reverse });
        let cascadeDelay = 0, layerDelay = (options.delay || 0), duration = clip ? timeline.current.time(clip) : 0;

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

    useImperativeHandle(combineRefs(self, ref), () => ({
        play,
        trigger,
        timeline: timeline.current,
        children: children.current,
        inherit,
        adaptive,
        manual,
        id
    }));

    useEffect(() => timeline.current[paused || disabled ? 'pause' : 'play'](), [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < triggers.length; i++) {
            let { name, on, ...options } = triggers[i];

            if (typeof on === 'string') continue;

            const value = typeof on === 'boolean' ? on : on.called, prev = triggersState.current[i];
            if (prev !== undefined && value && value !== prev) play(name || 'animate', options);

            triggersState.current[i] = value;
        }
    }, [triggers]);

    useEffect(() => {
        timeline.current.connect(mergedProps.animate);
        const resize = () => timeline.current.cache(); // maybe dont do this mid transition (also transition on resize within layoutgroup)
        window.addEventListener('resize', resize);

        parent?.add(self);

        document.fonts.ready.then(() => {
            if (!manual && !timeline.current.mounted) trigger('mount');
            timeline.current.mounted = true;
        });

        return () => {
            window.removeEventListener('resize', resize);

            parent?.remove(self);
        }
    }, []);

    return <AnimatableContext.Provider value={{
        ...(props.passthrough ? parent : { index, ...mergedProps }),
        add: (child: React.RefObject<AnimatableType>) => {
            if (props.passthrough) parent?.add(child);
            if (!children.current.includes(child)) children.current.push(child);
        },
        remove: (child: React.RefObject<AnimatableType>) => {
            if (props.passthrough) parent?.remove(child);
            const i = children.current.indexOf(child) || -1;

            if (i >= 0) children.current.splice(i, 1);
        }
    }}>
        {Children.map(props.children, child => {
            if (!isValidElement(child) || child.type instanceof Function) return child;

            return cloneElement(child as React.ReactElement, {
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
    </AnimatableContext.Provider>;
}

const Animatable = forwardRef(AnimatableBase) as (<T extends string>(props: AnimatableProps<T> & { ref?: React.ForwardedRef<AnimatableType>; }) => ReturnType<typeof AnimatableBase>) & { displayName: string; };

Animatable.displayName = 'Animatable';

export default Animatable;