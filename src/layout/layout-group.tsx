import { Children, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import { IndexedList, combineRefs } from "../core/utils";
import type { Easing } from "../core/clip";
import Morph from "./morph";
import Animate from "../animate";
import Typable from "./typable";

const isAnimatable = (child: React.ReactElement) => child.type === Animatable || child.type === Animate || child.type === Typable || child.type === Morph;

export default function LayoutGroup({ children, adaptive = true, transition = {} }: { children: React.ReactNode; adaptive?: boolean; transition?: { duration?: number; easing?: Easing } }) {
    const animatables = useRef<IndexedList<AnimatableType>>(new IndexedList());

    let animatableIndex = 0;
    const render = (children: React.ReactNode): React.ReactNode => {
        return Children.map(children, child => {
            if (!isValidElement(child)) return child;

            const props: { id?: string; ref?: React.Ref<any>; } = {};
            if (isAnimatable(child) && !(child.props.order > 1)) {
                const i = animatableIndex++;

                props.id = child.props.id || child.key;
                props.ref = combineRefs(el => el ? animatables.current.add(i, el) : animatables.current.remove(i), (child as any).ref);
            }

            if (child.type === Morph) return cloneElement(child, props);

            return cloneElement(child, props, render(child.props.children));
        });
    };

    const snapshot = useCallback((children: React.ReactNode, map: { [key: string]: boolean } = {}) => {
        Children.forEach(children, child => {
            if (!isValidElement(child)) return;

            const key = child.key || child.props.id;
            if (key !== null && isAnimatable(child)) map[key] = true;

            snapshot(child.props.children, map);
        });

        return map;
    }, []);

    const [state, setState] = useState(() => render(children));

    useEffect(() => {
        const mounted = snapshot(children);
        let unmounting = 0;

        for (const entry of animatables.current.values) {
            if (entry.unmount && !(entry.id in mounted)) {
                const isString = typeof entry.unmount === 'string';

                unmounting = Math.max(unmounting, entry.play(isString ? entry.unmount as string : 'animate', {
                    reverse: !isString,
                    immediate: true
                }));
            }
        }

        setTimeout(() => setState(render(children)), unmounting * 1000);
    }, [children]);

    (typeof window === 'undefined' ? useEffect : useLayoutEffect)(() => {
        if (typeof window === 'undefined' || !adaptive) return;

        animatables.current.forEach(entry => {
            if (!entry.mounted) return;

            entry.timeline.transition(undefined, transition);
        });
    }, [state]);

    return <>{state}</>;
}