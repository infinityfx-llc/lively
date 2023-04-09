'use client';

import { Children, cloneElement, forwardRef, isValidElement, useEffect, useImperativeHandle, useRef } from "react";
import Clip, { AnimatableInitials, ClipProperties } from "./core/clip";
import Timeline from "./core/timeline";
import { attachEvent, detachEvent, merge } from "./core/utils";

type PlayOptions = { composite?: boolean; immediate?: boolean; reverse?: boolean; delay?: number };

export type AnimatableType = {
    play: (animation: string | boolean, options?: PlayOptions, layer?: number) => number;
    transition: (transition?: number) => void;
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
    viewportMargin?: number;
    onMount?: boolean | string;
    onUnmount?: boolean | string;
    onEnter?: boolean | string;
    onLeave?: boolean | string;
    noCascade?: boolean;
    text?: boolean;
    disabled?: boolean;
    paused?: boolean;
    id?: string;
};

// TODO:
// - fix animation compositing
// - morph comp

// - events
// - spring easing
// - base correction of of cached styles, cause otherwise on repeat plays they keep changing

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
    viewportMargin = 0.5,
    onMount = false,
    onUnmount = false,
    onEnter = false,
    onLeave = false,
    noCascade = false,
    text = false,
    disabled = false,
    paused = false,
    id = ''
}, ref) => {

    const cascadeOrder = order !== undefined ? order : 1;
    const isVisible = useRef(false);
    const clipMap = useRef<{ [key: string]: Clip }>({});

    const timeline = useRef(new Timeline({
        stagger: text ? -1 : stagger,
        staggerLimit: text ? Number.MAX_VALUE : staggerLimit,
        deform
    }));
    const playbookState = useRef<boolean[]>([]);

    if (!clipMap.current.__initialized) {
        (clipMap.current as any).__initialized = true;
        clipMap.current.animate = Clip.from(animate, initial, timeline.current);

        for (const name in animations) {
            clipMap.current[name] = Clip.from(animations[name], initial);
        }
    }

    let nodes: (AnimatableType | null)[] = [];

    const play = (animation: string | boolean, options: PlayOptions = {}, layer = 1) => {
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
    };

    const transition = (transition = 0.5) => {
        if (cascadeOrder > 1) return;

        timeline.current.transition(transition);
    };

    useImperativeHandle(ref, () => ({
        play,
        transition,
        onUnmount,
        id
    }), []);

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

        function scroll() {
            if (!onEnter && !onLeave) return;

            const box = { left: Number.MAX_VALUE, top: Number.MAX_VALUE, right: 0, bottom: 0 };

            for (const track of timeline.current.tracks.values) {
                const { left, top, right, bottom } = track.element.getBoundingClientRect();

                box.left = Math.min(left, box.left);
                box.top = Math.min(top, box.top);
                box.right = Math.max(right, box.right);
                box.bottom = Math.max(bottom, box.bottom);
            }

            const w = box.right - box.left, h = box.bottom - box.top;
            box.top += h * viewportMargin;
            box.bottom -= h * viewportMargin;
            box.left += w * viewportMargin;
            box.right -= w * viewportMargin;

            const inView = box.top < window.innerHeight &&
                box.left < window.innerWidth &&
                box.bottom > 0 &&
                box.right > 0;

            if (inView && !isVisible.current && onEnter) {
                play(onEnter);
            }
            if (!inView && isVisible.current) {
                play(onLeave || onEnter, { reverse: !onLeave });
            }

            isVisible.current = inView;
        }

        attachEvent('scroll', scroll);

        (async () => {
            await document.fonts.ready;

            onMount ? play(onMount, { immediate: true }) : scroll();
        })();

        return () => detachEvent('scroll', scroll);
    }, []);

    let elementIndex = 0;

    const render = (children: React.ReactNode, isDirectChild = true, isParent = true): React.ReactNode => {
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
            } = {};

            if (isAnimatable) {
                if (!noCascade) {
                    const i = nodes.length++;

                    props.order = childProps.order !== undefined ? childProps.order : (order !== undefined ? order : 1) + 1;
                    props.paused = paused;
                    props.ref = el => nodes[i] = el;

                    merge(props, childProps, { animate, initial, animations, stagger, staggerLimit, deform });
                }
            } else
                if (isDirectChild) {
                    const i = elementIndex++;

                    props.pathLength = 1;
                    props.ref = el => timeline.current.insert(i, el);
                    props.style = merge({ WebkitBackfaceVisibility: 'hidden', strokeDasharray: 1 }, initial || clipMap.current.animate.initial, childProps.style);
                }

            if (!valid) {
                if (!isDirectChild) return child;
                if (text && typeof child === 'string') {
                    const arr = child.split(''), offset = elementIndex;
                    elementIndex += arr.length;

                    return arr.map((char, i) => <span ref={el => timeline.current.insert(offset + i, el)} style={{ minWidth: char === ' ' ? '0.35em' : 0 }}>{char}</span>);
                }

                return <div {...props}>{child}</div>;
            }

            return cloneElement(child, props, render(childProps.children, false, !isParent ? false : !isAnimatable));
        });
    };

    return <>{render(children)}</>;
});

export default Animatable;