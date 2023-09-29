import { useRef } from "react";

type Port = (transition: number) => void;

type LinkArgument<T> = number | ((value: T, index: number) => any);

export type Link<T> = ((transform?: LinkArgument<T>) => any | Link<T>) | (() => T) & { connect: (port: Port) => void };

// function createAnimationValue(initial: number) { // maybe rewrite lively based on this?
//     return (function scale(this: { value: number; prev: number; dt: number; t: number; }, value?: number, transition = 0) {
//         let r = Math.max(this.t - Date.now(), 0) / (this.dt || 1);
//         r = (1 - Math.cos(r * Math.PI)) / 2;

//         const current = this.prev * r + this.value * (1 - r);

//         if (value !== undefined) {
//             this.prev = current;
//             this.value = value;
//             this.dt = transition * 1000;
//             this.t = transition * 1000 + Date.now();
//         }

//         return current;
//     }).bind({ value: initial, prev: initial, dt: 0, t: Date.now() });
// }

export default function useLink<T = any>(initial: T): [Link<T>, (value: T, transition?: number) => void] {
    const internal = useRef<T>(initial);
    const ports = useRef<Port[]>([]);

    function connect(port: Port) {
        if (!ports.current.includes(port)) ports.current.push(port);
    }

    const createLink = (transform: (value: T, index: number) => any = val => val): Link<T> => {
        function link(transform?: LinkArgument<T>) {
            if (!(transform instanceof Function)) return link.transform(internal.current, transform || 0);

            return createLink(transform);
        }

        link.transform = transform;
        link.connect = connect;

        return link;
    }

    function update(value: T, transition = 0) {
        requestAnimationFrame(() => {
            internal.current = value;

            for (const port of ports.current) port(transition);
        });
    }

    return [createLink(), update];
}