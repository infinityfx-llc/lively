'use client';

import { useCallback, useRef } from "react";
import useLink from "./use-link";
import { asArray } from "../core/utils";
import AnimationLink from "../core/animation-link";

type SpringOptions = {
    stiffness?: number;
    damping?: number;
    mass?: number;
};

export default function useSpring(initial: number, options?: SpringOptions): AnimationLink<number>;
export default function useSpring(initial: number[], options?: SpringOptions): AnimationLink<number[]>;
export default function useSpring(initial: number | number[], {
    stiffness = 2,
    damping = .1,
    mass = 1
} = {}) {
    const isArray = Array.isArray(initial);
    const state = useRef({
        target: asArray(initial),
        velocity: new Array(isArray ? initial.length : 1).fill(0),
        time: 0
    });
    const link = useLink(initial);

    const update = useCallback(() => {
        const deltaT = Math.min((Date.now() - state.current.time) / 1000, 1 / 30);
        const { target, velocity } = state.current;
        const value = link.get();
        const values: number[] = isArray ? value as any : [value];

        let difference = 0;
        for (let i = 0; i < velocity.length; i++) {
            velocity[i] += ((stiffness * (target[i] - values[i])) - (damping * velocity[i])) / mass;
            values[i] += velocity[i] * deltaT;

            difference += Math.abs(velocity[i]) / velocity.length;
        }

        link.value = isArray ? values as any : values[0];
        link.options.duration = 0;
        link.dispatch('change');

        state.current.time = Date.now();
        if (difference > .01) requestAnimationFrame(update);
        // else dispatch animation end somehow?
    }, []);

    link.set = (value) => {
        if (value === state.current.target) return;
        
        state.current.target = asArray(value);
        state.current.time = Date.now();

        requestAnimationFrame(update);
    }

    return link as any;
}