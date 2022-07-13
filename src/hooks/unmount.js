import { useEffect, useRef, useState } from 'react';

export default function useUnmount(state) {
    const [mounted, setMounted] = useState(state);
    const ref = useRef();

    useEffect(() => {
        if (state) setMounted(true);
        if (!state && ref.current?.props.onUnmount) {
            ref.current.play(ref.current.props.onUnmount, {
                reverse: true,
                immediate: true,
                callback: () => setMounted(false)
            });
        }
    }, [state]);

    return [mounted, ref];
}