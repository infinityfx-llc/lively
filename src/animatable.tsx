import { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Clip, { AnimatableInitials, AnimatableKey, ClipProperties } from "./core/clip";
import Timeline from "./core/timeline";
import { combineRefs, merge } from "./core/utils";
import useTrigger, { Trigger } from "./hooks/use-trigger";
// import { Morph } from "./layout";

type PlayOptions = { composite?: boolean; immediate?: boolean; reverse?: boolean; delay?: number };

export type AnimatableType = {
    play: (animation: string, options?: PlayOptions, layer?: number) => number;
    timeline: Timeline;
    mounted: boolean;
    unmount: boolean | string;
    id: string;
};

export type AnimatableProps = {
    children: React.ReactNode;
    animations?: { [key: string]: ClipProperties | Clip };
    triggers?: ({ name?: string; on: Trigger | boolean | 'mount' } & PlayOptions)[];
    animate?: ClipProperties | Clip;
    initial?: AnimatableInitials;
    stagger?: number;
    staggerLimit?: number;
    deform?: boolean;
    order?: number;
    cachable?: AnimatableKey[];
    unmount?: boolean | string;
    noInherit?: boolean;
    disabled?: boolean;
    paused?: boolean;
    id?: string;
    // shown?: boolean;
};

// TODO:
// - useScroll hook choose element/direction
// - text animation testing (hard state transition)
// - maybe allow for animatable inside morph??
// - support easing array for individual keyframes
// - individual borderRadius support
// - morph nesting

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
    cachable,
    unmount = false,
    disabled = false,
    paused,
    id = '',
    // shown
}, ref) => {

    const cascadeOrder = order !== undefined ? order : 1;
    const mount = useTrigger();
    const triggersState = useRef<(number | boolean)[]>([]);
    const nodes = useRef<(AnimatableType | null)[]>([]);

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
        mountClips: triggers.reduce<Clip[]>((clips, { name, on }) => {
            if (on === 'mount') clips.push(clipMap[name || 'animate']);

            return clips;
        }, [])
    }));

    const play = useCallback((animation: string, options: PlayOptions = {}, layer = 1) => {
        const clip = clipMap[animation];
        if (!clip || disabled || (cascadeOrder > 1 && layer < 2)) return 0;

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
        mounted: mount.value > 0,
        unmount,
        id
    }), [id, mount, unmount]);

    useEffect(() => {
        if (paused || disabled) {
            timeline.current.pause();
        } else {
            timeline.current.play();
        }
    }, [paused, disabled]);

    useEffect(() => {
        for (let i = 0; i < triggers.length; i++) {
            let { name, on, ...options } = triggers[i];

            if (on === 'mount') {
                if (options.immediate === undefined) options.immediate = true;
                on = mount;
            }

            const value = typeof on === 'boolean' ? on : on.value;
            if (mount.value > 0 && value && value !== triggersState.current[i]) play(name || 'animate', options);

            triggersState.current[i] = value;
        }
    }, [triggers, mount]);

    useEffect(() => {
        timeline.current.step();
        timeline.current.connect(animate);
        const resize = () => timeline.current.cache(); // maybe dont do this mid transition (also transition on resize within layoutgroup)
        window.addEventListener('resize', resize);

        document.fonts.ready.then(() => {
            mount();
            timeline.current.mounted = true;
        });

        return () => window.removeEventListener('resize', resize);
    }, []);

    useEffect(() => {
        timeline.current.tracks.forEach(track => {
            if (!track.element.isConnected) timeline.current.tracks.remove((track.element as any).TRACK_INDEX);
        });
    }, [children]);

    let index = 0;
    
    function render(children: React.ReactNode, isDirectChild = true, isParent = true): React.ReactNode {
        return Children.map(children, child => {
            if (!isValidElement(child)) return child;
            const isAnimatable = child.type === Animatable;
            // const isAnimatable = child.type === Animatable || child.type === Morph; // Typable

            const props: {
                order?: number;
                paused?: boolean;
                pathLength?: number;
                style?: React.CSSProperties;
                ref?: React.Ref<any>;
                id?: string;
                // shown?: boolean;
            } = {};

            if (isAnimatable) {
                if (!child.props.noInherit) {
                    const i = index++;

                    props.order = child.props.order !== undefined ? child.props.order : cascadeOrder + 1;
                    props.ref = combineRefs(el => nodes.current[i] = el, (child as any).ref);
                    props.id = id + i;

                    merge(props, child.props, { animate, initial, animations, stagger, staggerLimit, deform, paused });
                    // merge(props, child.props, { animate, initial, animations, stagger, staggerLimit, deform, paused, shown });
                }
            } else
                if (isDirectChild) {
                    props.pathLength = 1;
                    props.ref = combineRefs(el => timeline.current.insert(el), (child as any).ref);
                    props.style = merge({ backfaceVisibility: 'hidden', willChange: 'transform' }, clipMap.animate.initial, child.props.style, { strokeDasharray: 1 });
                }

            return cloneElement(child, props, render(child.props.children, false, isParent && !isAnimatable));
        });
    }

    return <>{render(children)}</>;
});
Animatable.displayName = 'Animatable';

export default Animatable;