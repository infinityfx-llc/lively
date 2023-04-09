'use client';

import { useRef } from "react";

type Port = (transition: number) => void;

export type Link<T> = ((transform?: (value: T) => any) => T | Link<T>) & { connect: (port: Port) => void };

export default function useLink<T = any>(initial: T): [Link<T>, (value: T, transition?: number) => void] {
    const internal = useRef<T>(initial);
    const ports = useRef<Port[]>([]);

    function connect(port: Port) {
        if (!ports.current.includes(port)) ports.current.push(port);
    }

    function link(transform?: (value: T) => any) {
        if (!transform) return internal.current;

        const transformedLink = () => transform(internal.current);
        transformedLink.connect = connect;

        return transformedLink;
    }

    link.connect = connect;

    function update(value: T, transition = 0) {
        internal.current = value;

        requestAnimationFrame(() => {
            for (const port of ports.current) port(transition);
        });
    }

    return [link, update];
}