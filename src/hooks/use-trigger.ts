import { useMemo, useState } from "react";

export type Trigger = (() => void) & { called: number; };

export default function useTrigger(): Trigger {
    const [state, setState] = useState(0);

    const trigger = useMemo(() => {
        function trigger() {
            setState(state + 1);
        }
        
        trigger.called = state;

        return trigger;
    }, [state]);

    return trigger;
}