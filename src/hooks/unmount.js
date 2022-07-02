import { useEffect, useRef, useState } from 'react';

function useUnmount(state) {
    const [mounted, setMounted] = useState(state);
    const ref = useRef();

    useEffect(() => {
        if (state) setMounted(true);
        if (!state && ref.current) {
            ref.current.play(ref.current.props.onUnmount, { callback: () => {
                setMounted(false);
            }});
        }
    }, [state]);

    return [mounted, ref];
}

export default useUnmount;