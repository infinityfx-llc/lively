import { useEffect, useState } from 'react';

export default function useReducedMotion() {
    const [state, setState] = useState(false);

    const onChange = e => setState(e.matches);

    useEffect(() => {
        const query = matchMedia('(prefers-reduced-motion: reduce)');
        query.addEventListener('change', onChange);
        setState(query.matches);

        return () => query.removeEventListener('change', onChange);
    }, []);

    return state;
}