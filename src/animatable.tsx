import { Children, cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Clip, { AnimatableInitials, AnimatableKey, ClipProperties } from "./core/clip";
import useTrigger, { Trigger } from "./hooks/use-trigger";
import Timeline from "./core/timeline";
import { combineRefs, merge } from "./core/utils";

type PlayOptions = { composite?: boolean; immediate?: boolean; reverse?: boolean; delay?: number };

export type AnimatableType = {
    play: (animation: string, options?: PlayOptions, layer?: number) => number;
    timeline: Timeline;
    children: React.MutableRefObject<AnimatableType | null>[];
    inherit: boolean | undefined;
    unmount: () => number;
    id: string;
};

type SharedProps = {
    id?: string;
    animations?: { [key: string]: ClipProperties | Clip };
    triggers?: ({ name?: string; on: Trigger | boolean | 'mount' | 'unmount' } & PlayOptions)[];
    animate?: ClipProperties | Clip;
    initial?: AnimatableInitials;
    stagger?: number;
    staggerLimit?: number;
    deform?: boolean;
    disabled?: boolean;
    paused?: boolean;
}

export type AnimatableProps = {
    children: React.ReactNode;
    order?: number;
    inherit?: boolean;
    cachable?: AnimatableKey[];
} & SharedProps;

export const AnimatableContext = createContext<null | ({
    index: number;
    children: React.MutableRefObject<AnimatableType | null>[];
} & SharedProps)>(null);

const Animatable = forwardRef<AnimatableType, AnimatableProps>((props, ref) => {
    const self = useRef<AnimatableType>(null);
    const children = useRef<React.MutableRefObject<AnimatableType | null>[]>([]);
    const parent = useContext(AnimatableContext);

    const {
        id = '',
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
        triggers = []
    } = props.inherit && parent ? merge({}, props, parent) : props;

    const index = order !== undefined ? order : (props.inherit && parent?.index || 0) + 1;
    const triggersState = useRef<(number | boolean)[]>([]);
    const mount = useTrigger();

    const [clipMap] = useState(() => {
        const map: { [key: string]: Clip } = { animate: Clip.from(animate, initial) };

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
        // @ts-ignore
        mountClips: triggers.reduce<Clip[]>((clips, { name, on }) => {
            if (on === 'mount') clips.push(clipMap[name || 'animate']);

            return clips;
        }, [])
    }));

    const play = useCallback((animation: string, options: PlayOptions = {}, layer = 1) => {
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

        return duration + delay;
    }, [disabled, index]);

    function unmount() { // CHECK TO OPTIMIZE
        let duration = 0;

        for (const { name, on, ...options } of triggers) {
            if (on !== 'unmount') continue;

            duration = Math.max(play(name || 'animate', options), duration);
        }

        for (const child of children.current) {
            if (!child.current?.inherit) continue;

            duration = Math.max(child.current.unmount(), duration);
        }

        return duration;
    }

    useImperativeHandle(combineRefs(self, ref), () => ({
        play,
        unmount,
        timeline: timeline.current,
        children: children.current,
        inherit: props.inherit,
        id
    }), []);

    useEffect(() => {
        paused || disabled ? timeline.current.pause() : timeline.current.play();
    }, [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < triggers.length; i++) {
            let { name, on, ...options } = triggers[i];

            if (on === 'unmount') continue;
            if (on === 'mount') {
                merge(options, { immediate: true });
                on = mount;
            }

            const value = on.value !== undefined ? on.value : on, prev = triggersState.current[i];
            if (prev !== undefined && value && value !== prev) play(name || 'animate', options);

            triggersState.current[i] = value;
        }
    }, [triggers, mount]);

    useEffect(() => {
        timeline.current.step();
        timeline.current.connect(animate);
        const resize = () => timeline.current.cache(); // maybe dont do this mid transition (also transition on resize within layoutgroup)
        window.addEventListener('resize', resize);

        if (parent && parent.children.indexOf(self) < 0) parent.children.push(self);

        document.fonts.ready.then(() => {
            mount();
            timeline.current.mounted = true;
        });

        return () => {
            window.removeEventListener('resize', resize);

            const i = parent?.children.indexOf(self) || -1;
            // @ts-expect-error FIX TYPING!!
            if (i >= 0) parent.children.splice(i, 1);
        }
    }, []);

    return <AnimatableContext.Provider value={{
        id,
        index,
        animate,
        initial,
        animations,
        stagger,
        staggerLimit,
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
                    clipMap.animate.initial,
                    (child as any).props.style,
                    {
                        strokeDasharray: 1
                    }
                )
            });
        })}
    </AnimatableContext.Provider>;
});

Animatable.displayName = 'Animatable';

export default Animatable;