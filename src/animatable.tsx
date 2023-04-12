'use client';

import { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useImperativeHandle, useRef } from "react";
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
    playbook?: ({ name: string; trigger: boolean } & PlayOptions)[];
    animate?: ClipProperties | Clip;
    initial?: AnimatableInitials;
    stagger?: number;
    staggerLimit?: number;
    deform?: boolean;
    order?: number;
    onMount?: boolean | string;
    onUnmount?: boolean | string;
    noCascade?: boolean;
    text?: boolean;
    disabled?: boolean;
    paused?: boolean;
    id?: string;
};

// TODO:
// - spring easing
// - start, end keyframes
// - check if empty animation still gets added to track for full duration (thus causing delays)
// - individual borderRadius support
// - detect when element.isConnected = false, then remove track
// - morph nesting
// - cascade animations seem broken

const Animatable = forwardRef<AnimatableType, AnimatableProps>(({
    children,
    animations,
    playbook = [],
    animate,
    initial,
    stagger,
    staggerLimit,
    deform,
    order,
    onMount = false,
    onUnmount = false,
    noCascade = false,
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
    const playbookState = useRef<boolean[]>([]);
    let nodes: (AnimatableType | null)[] = [];

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

        for (const node of nodes) {
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
    }), [onUnmount]);

    useEffect(() => {
        if (paused || disabled) timeline.current.pause();
        if (!paused && !disabled) timeline.current.play();
    }, [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < playbook.length; i++) {
            const { name, trigger, ...options } = playbook[i];

            if (trigger !== playbookState.current[i] && trigger) play(name, options);

            playbookState.current[i] = trigger;
        }
    }, [playbook]);

    useEffect(() => {
        timeline.current.step();
        mounted.current = true;

        document.fonts.ready.then(() => play(onMount, { immediate: true }));
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
                if (!noCascade) {
                    const i = nodes.length++;

                    props.order = childProps.order !== undefined ? childProps.order : (order !== undefined ? order : 1) + 1;
                    props.paused = paused;
                    props.ref = el => nodes[i] = el;
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
                    props.style = merge({ backfaceVisibility: 'hidden', strokeDasharray: 1 }, initial || clipMap.current.animate.initial, childProps.style);
                }

            if (!valid) {
                if (!isDirectChild || !['string', 'number', 'boolean'].includes(typeof child)) return child;

                if (text && typeof child === 'string') {
                    return child.split('').map((char, i) => <span ref={el => timeline.current.insert(el)} style={{ minWidth: char === ' ' ? '0.35em' : 0 }}>{char}</span>);
                }

                return <div {...props}>{child}</div>;
            }

            return cloneElement(child, props, render(childProps.children, false, !isParent ? false : !isAnimatable));
        });
    }

    return <>{render(children)}</>;
});

export default Animatable;