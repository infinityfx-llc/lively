import { Children, cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Clip, { AnimatableInitials, AnimatableKey, ClipProperties } from "./core/clip";
import { Trigger } from "./hooks/use-trigger";
import Timeline, { PlayOptions } from "./core/timeline";
import { combineRefs, merge } from "./core/utils";

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
    adaptive?: boolean;
    cachable?: AnimatableKey[];
    manual?: boolean;
    onAnimationEnd?: (animation: T | 'animate') => void;
} & SharedProps<T>;

export const AnimatableContext = createContext<null | ({
    index: number;
    children: React.MutableRefObject<AnimatableType | null>[];
} & SharedProps)>(null);

function AnimatableBase<T extends string>(props: AnimatableProps<T>, ref: React.ForwardedRef<AnimatableType>) {
    const self = useRef<AnimatableType<T>>(null);
    const children = useRef<React.MutableRefObject<AnimatableType | null>[]>([]);
    const parent = useContext(AnimatableContext);

    const {
        id = '',
        group,
        order,
        paused,
        disabled,
        animate,
        initial,
        animations,
        stagger,
        staggerLimit,
        deform,
        cachable,
        adaptive = false,
        manual = false,
        triggers = [],
        onAnimationEnd
    } = props.inherit && parent ? merge({}, props, parent) : props;

    const index = order !== undefined ? order : (props.inherit && parent?.index || 0) + 1;
    const triggersState = useRef<(number | boolean)[]>([]);

    const [clipMap] = useState(() => {
        const map: { [key: string]: Clip; } = { animate: Clip.from(animate, initial) };

        for (const name in animations) {
            map[name] = Clip.from(animations[name], initial);
        }

        return map;
    });

    const timeline = useRef(new Timeline({
        stagger,
        staggerLimit,
        deform,
        cachable,
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

        if (onAnimationEnd) setTimeout(onAnimationEnd.bind({}, animation), (duration + delay) * 1000);
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
        inherit: props.inherit,
        adaptive,
        manual,
        id
    }));

    useEffect(() => {
        paused || disabled ? timeline.current.pause() : timeline.current.play();
    }, [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < triggers.length; i++) {
            let { name, on, ...options } = triggers[i];

            if (typeof on === 'string') continue;

            const value = typeof on === 'boolean' ? on : on.value, prev = triggersState.current[i];
            if (prev !== undefined && value && value !== prev) play(name || 'animate', options);

            triggersState.current[i] = value;
        }
    }, [triggers]);

    useEffect(() => {
        timeline.current.step();
        timeline.current.connect(animate);
        const resize = () => timeline.current.cache(); // maybe dont do this mid transition (also transition on resize within layoutgroup)
        window.addEventListener('resize', resize);

        if (parent && parent.children.indexOf(self) < 0) parent.children.push(self);

        document.fonts.ready.then(() => {
            if (!manual && !timeline.current.mounted) trigger('mount');
            timeline.current.mounted = true;
        });

        return () => {
            window.removeEventListener('resize', resize);

            const i = parent?.children.indexOf(self) || -1;
            // @ts-expect-error
            if (i >= 0) parent.children.splice(i, 1);
        }
    }, []);

    return <AnimatableContext.Provider value={{
        group,
        index,
        animate,
        initial,
        animations,
        stagger,
        staggerLimit,
        triggers,
        deform,
        paused,
        disabled,
        children: children.current
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
                'data-lively-offset-boundary': cachable?.includes('translate') || cachable === undefined ? true : undefined
            });
        })}
    </AnimatableContext.Provider>;
}

const Animatable = forwardRef(AnimatableBase) as (<T extends string>(props: AnimatableProps<T> & { ref?: React.ForwardedRef<AnimatableType>; }) => ReturnType<typeof AnimatableBase>) & { displayName: string; };

Animatable.displayName = 'Animatable';

export default Animatable;