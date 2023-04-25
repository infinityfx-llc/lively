import { useEffect, useRef } from "react";
import useTrigger, { Trigger } from "./use-trigger";

export default function useVisible<T extends Element = any>({ enter = true, exit = false, threshold = 0.5 } = {}): [Trigger, React.Ref<T>] {
    const ref = useRef<T>(null);
    const trigger = useTrigger();

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (enter) trigger();
            } else
            if (exit) trigger();
        }, { threshold });
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref]);

    return [trigger, ref];
}