'use client';

import { useEffect, useState } from "react";
import useLink, { isLink } from "./use-link";

// transition duration fix

export default function useCouple<T>(callback: () => T, dependencies: unknown[] = []) {
    const [initial] = useState(callback);
    const link = useLink<T>(initial);

    useEffect(() => {
        const cb = () => link.set(callback());

        cb();

        dependencies.forEach(link => {
            if (isLink(link)) link.onchange(cb);
        });

        return () => dependencies.forEach(link => {
            if (isLink(link)) link.offchange(cb);
        });
    }, dependencies);

    return link;
}