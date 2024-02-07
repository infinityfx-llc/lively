import { useMemo, useState } from "react";

export type Trigger = ((called?: number) => void) & { value: number; called: number; };

export default function useTrigger(): Trigger {
    const [state, setState] = useState({ called: 0, value: 0 });

    const trigger = useMemo(() => {
        function trigger(called = state.called + 1) {
            setState({ called, value: state.value + 1 });
        }
        
        trigger.called = state.called;
        trigger.value = state.value;

        return trigger;
    }, [state]);

    return trigger;
}