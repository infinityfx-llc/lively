import { useRef } from "react";
import useLink from "./use-link";

export default function useSpring<T extends number | number[]>(initial: T, { stiffness = 2, damping = .1, mass = 1, restThreshold = 0.01 } = {}) {
    const state = useRef({
        t: 0,
        value: initial,
        velocity: new Array(Array.isArray(initial) ? initial.length : 1).fill(0)
    });

    const internal = useLink(initial);
    const link = useRef(internal(val => val));

    function update() {
        const t = Date.now(),
            dt = Math.min((t - state.current.t) / 1000, 1 / 12),
            value = internal(),
            velocity = state.current.velocity,
            isVector = Array.isArray(value);

        let scalarOffset = 0,
            scalarVelocity = 0;

        const vec = isVector ? value : [value];
        const tar = Array.isArray(state.current.value) ? state.current.value : [state.current.value];

        for (let i = 0; i < velocity.length; i++) {
            const offset = tar[i] - vec[i];
            velocity[i] += ((stiffness * offset) - (damping * velocity[i])) / mass;

            vec[i] += velocity[i] * dt;

            scalarOffset += Math.abs(offset);
            scalarVelocity += Math.abs(velocity[i]);
        }

        scalarOffset /= velocity.length;
        scalarVelocity /= velocity.length;

        internal.set(isVector ? vec : vec[0]);

        state.current.t = t;
        if (scalarOffset > restThreshold || scalarVelocity > restThreshold) requestAnimationFrame(update);
    }

    link.current.set = (value: T) => {
        state.current.value = value;
        state.current.t = Date.now();

        requestAnimationFrame(update);
    }

    return link.current;
}