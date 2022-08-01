import { useRef, useState } from 'react';

export default function useUnmount(initial) {
    const [state, setState] = useState(initial);
    const ref = useRef();

    const setMounted = () => {
        if (!state) return setState(true);

        if (ref.current?.props.onUnmount) {
            ref.current.play(ref.current.props.onUnmount, {
                reverse: true,
                immediate: true,
                callback: () => setState(false)
            });
        }
    };

    return [state, setMounted, ref];
}