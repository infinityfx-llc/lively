import { useMemo, useState } from "react";

export type Trigger = (() => void) & { value: number; };

export default function useTrigger(): Trigger {
    const [state, setState] = useState(0);

    const trigger = useMemo(() => {
        function trigger() {
            setState(state + 1);
        }
        trigger.value = state;

        return trigger;
    }, [state])

    return trigger;
}