'use client';

import { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Clip, { AnimatableInitials, ClipProperties } from "./core/clip";
import Timeline from "./core/timeline";
import { merge } from "./core/utils";

type PlayOptions = { composite?: boolean; immediate?: boolean; reverse?: boolean; delay?: number };

export type AnimatableType = {
    play: (animation: string | boolean, options?: PlayOptions, layer?: number) => number;
    timeline: Timeline;
    mounted: boolean;
    onUnmount: boolean | string;
    id: string;
};

export type AnimatableProps = {
    children: React.ReactNode;
    animations?: { [key: string]: ClipProperties | Clip };
    triggers?: ({ name?: string; on: boolean | 'mount' } & PlayOptions)[];
    animate?: ClipProperties | Clip;
    initial?: AnimatableInitials;
    stagger?: number;
    staggerLimit?: number;
    deform?: boolean;
    order?: number;
    onUnmount?: boolean | string;
    noCascade?: boolean;
    text?: boolean;
    disabled?: boolean;
    paused?: boolean;
    id?: string;
};

// TODO:
// - individual borderRadius support
// - morph nesting
// - text animation testing (hard state transition)
// - maybe allow for animatable inside morph??

const Animatable = forwardRef<AnimatableType, AnimatableProps>(({
    children,
    animations,
    triggers = [],
    animate,
    initial,
    stagger,
    staggerLimit,
    deform,
    order,
    onUnmount = false,
    text = false,
    disabled = false,
    paused = false,
    id = ''
}, ref) => {

    const cascadeOrder = order !== undefined ? order : 1;
    const clipMap = useRef<{ [key: string]: Clip }>({});
    const mounted = useRef(false);

    const timeline = useRef(new Timeline({
        stagger: text ? -1 : stagger,
        staggerLimit: text ? Number.MAX_VALUE : staggerLimit,
        deform
    }));
    const triggersState = useRef<(boolean | number)[]>([]);
    const [events, setEvents] = useState<{ [key: string]: any }>({
        mount: 0,
    });
    const trigger = (name: 'mount') => setEvents({ ...events, [name]: events[name] + 1 });
    const nodes = useRef<(AnimatableType | null)[]>([]);

    if (!clipMap.current.__initialized) {
        (clipMap.current as any).__initialized = true;
        clipMap.current.animate = Clip.from(animate, initial, timeline.current);

        for (const name in animations) {
            clipMap.current[name] = Clip.from(animations[name], initial);
        }
    }

    const play = useCallback((animation: string | boolean, options: PlayOptions = {}, layer = 1) => {
        if (!animation || disabled || (cascadeOrder > 1 && layer < 2)) return 0;
        if (typeof animation !== 'string') animation = 'animate';
        const clip = clipMap.current[animation];

        if (!clip) return 0;

        let cascadeDelay = 0,
            layerDelay = (options.delay || 0),
            duration = timeline.current.time(clip);

        for (const node of nodes.current) {
            if (!node) continue;

            const delay = node.play(animation, merge({
                delay: layerDelay + duration
            }, options), layer + 1);

            cascadeDelay = Math.max(cascadeDelay, delay);
        }

        const delay = (options.reverse ? cascadeDelay : layerDelay) * (cascadeOrder / layer);
        timeline.current.add(clip, merge({ delay }, options));

        return duration + delay;
    }, [disabled, cascadeOrder]);

    useImperativeHandle(ref, () => ({
        play,
        timeline: timeline.current,
        mounted: mounted.current,
        onUnmount,
        id
    }), [id, onUnmount]);

    useEffect(() => {
        if (paused || disabled) timeline.current.pause();
        if (!paused && !disabled) timeline.current.play();
    }, [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < triggers.length; i++) {
            let { name, on, ...options }: { name?: string, on: boolean | string | number } & PlayOptions = triggers[i];

            if (typeof on === 'string') {
                if (options.immediate === undefined) options.immediate = true;
                on = events[on] as number;
            }
            if (on !== triggersState.current[i] && on) play(name || 'animate', options);

            triggersState.current[i] = on;
        }
    }, [triggers, events]);

    useEffect(() => {
        timeline.current.step();
        mounted.current = true;

        document.fonts.ready.then(() => trigger('mount'));
    }, []);

    function render(children: React.ReactNode, isDirectChild = true, isParent = true): React.ReactNode {
        return Children.map(children, child => {
            const valid = isValidElement(child);
            const isAnimatable = valid && child.type === Animatable;

            const childProps: any = valid ? child.props : {};
            const props: {
                order?: number;
                paused?: boolean;
                pathLength?: number;
                style?: React.CSSProperties;
                ref?: React.Ref<any>;
                id?: string;
            } = {};

            if (isAnimatable) {
                if (!childProps.noCascade) {
                    const i = nodes.current.length++;

                    props.order = childProps.order !== undefined ? childProps.order : (order !== undefined ? order : 1) + 1;
                    props.paused = paused;
                    props.ref = el => nodes.current[i] = el;
                    props.id = id + i;

                    merge(props, childProps, { animate, initial, animations, stagger, staggerLimit, deform });
                }
            } else
                if (isDirectChild) {
                    const ref = valid && (child as any).ref;

                    props.pathLength = 1;
                    props.ref = el => {
                        timeline.current.insert(el);
                        if (ref && 'current' in ref) ref.current = el;
                        if (ref instanceof Function) ref(el);
                    }
                    props.style = merge({ backfaceVisibility: 'hidden', willChange: 'transform', strokeDasharray: 1 }, initial || clipMap.current.animate.initial, childProps.style);
                }

            if (!valid) {
                if (!isDirectChild || !['string', 'number', 'boolean'].includes(typeof child)) return child;

                if (text && typeof child === 'string') {
                    return child.split('').map(char => <span ref={el => timeline.current.insert(el)} style={{ ...props.style, minWidth: char === ' ' ? '0.35em' : 0 }}>{char}</span>);
                }

                return <div {...props}>{child}</div>;
            }

            return cloneElement(child, props, render(childProps.children, false, !isParent ? false : !isAnimatable));
        });
    }

    return <>{render(children)}</>;
});

export default Animatable;