'use client';

import { useMemo, useRef, useState } from "react";

export type Trigger = (() => void) & { called: number; };

export default function useTrigger(): Trigger {
    const called = useRef(0);
    const [state, setState] = useState(0);

    const trigger = useMemo(() => {
        function trigger() {
            setState(called.current + 1);
        }
        
        trigger.called = state;

        return trigger;
    }, [state]);

    return trigger;
}