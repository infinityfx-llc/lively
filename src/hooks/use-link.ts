'use client';

import { useRef } from "react";

type Port = (transition: number) => void;

type LinkArgument<T> = number | ((value: T, index: number) => any);

export type Link<T> = ((transform?: LinkArgument<T>) => T | Link<T>) & { connect: (port: Port) => void };

export default function useLink<T = any>(initial: T): [Link<T>, (value: T, transition?: number) => void] {
    const internal = useRef<T>(initial);
    const ports = useRef<Port[]>([]);

    function connect(port: Port) {
        if (!ports.current.includes(port)) ports.current.push(port);
    }

    function link(transform?: LinkArgument<T>) {
        if (!(transform instanceof Function)) return internal.current;

        const transformedLink = (index?: LinkArgument<T>) => transform(internal.current, typeof index === 'number' ? index : 0);
        transformedLink.connect = connect;

        return transformedLink;
    }

    link.connect = connect;

    function update(value: T, transition = 0) {
        requestAnimationFrame(() => {
            internal.current = value;

            for (const port of ports.current) port(transition);
        });
    }

    return [link, update];
}