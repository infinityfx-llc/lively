'use client';

import { Children, cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "./animatable";
import { IndexedList } from "./core/utils";

export default function LayoutGroup({ children, transition = 0.5 }: { children: React.ReactNode; transition?: number }) {
    const animatables = useRef<IndexedList<AnimatableType>>(new IndexedList());

    let animatableIndex = 0;
    const render = (children: React.ReactNode): React.ReactNode => {
        return Children.map(children, child => {
            if (!isValidElement(child) || child.type !== Animatable) return child;

            const i = animatableIndex++;
            return cloneElement(child, {
                id: child.key,
                ref: (el: any) => {
                    el ? animatables.current.add(i, el) : animatables.current.remove(i);
                }
            } as any, render(child.props.children));
        });
    };

    const snapshot = (children: React.ReactNode, map: { [key: string]: boolean } = {}) => { // maybe usecallback (also for all other functions)
        Children.forEach(children, child => {
            if (!isValidElement(child) || child.type !== Animatable || child.key === null) return;

            map[child.key] = true;

            snapshot(child.props.children, map);
        });

        return map;
    };

    const [state, setState] = useState(() => render(children));

    useEffect(() => {
        const mounted = snapshot(children);
        let unmounting = 0;

        for (const entry of animatables.current.values) {
            if (entry.onUnmount && !(entry.id in mounted)) {
                unmounting = Math.max(unmounting, entry.play(entry.onUnmount, {
                    reverse: typeof entry.onUnmount === 'string' ? false : true,
                    immediate: true
                }));
            }
        }

        setTimeout(() => setState(render(children)), unmounting * 1000);
    }, [children]);

    (typeof window === 'undefined' ? useEffect : useLayoutEffect)(() => {
        if (typeof window === 'undefined') return;

        animatables.current.forEach(entry => entry.transition(transition));
    }, [state]);

    return <>{state}</>;
}