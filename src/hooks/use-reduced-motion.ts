'use client';

import { useEffect, useState } from 'react';

export default function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const change = (e: MediaQueryListEvent) => setReduced(e.matches);

        const query = matchMedia('(prefers-reduced-motion: reduce)');
        query.addEventListener('change', change);
        setReduced(query.matches);

        return () => query.removeEventListener('change', change);
    }, []);

    return reduced;
}