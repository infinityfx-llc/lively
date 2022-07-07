import { useEffect, useRef, useState } from 'react';

export default function useUnmount(state) {
    const [mounted, setMounted] = useState(state);
    const ref = useRef();

    useEffect(() => {
        if (state) setMounted(true);
        if (!state && ref.current) {
            ref.current.play(ref.current.props.onUnmount, { // test if onUnmount is present
                reverse: true,
                callback: () => {
                    setMounted(false);
                }
            });
        }
    }, [state]);

    return [mounted, ref];
}