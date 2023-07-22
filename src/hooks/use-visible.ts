import { useEffect, useRef } from "react";
import useTrigger, { Trigger } from "./use-trigger";

export default function useVisible<T extends Element = any>({ enter = true, exit = false, threshold = 0.5 } = {}): [Trigger, React.Ref<T>] {
    const ref = useRef<T>(null);
    const visible = useRef(false);
    const trigger = useTrigger();

    function update() {
        if (!ref.current) return;

        const { x, y, width, height } = ref.current.getBoundingClientRect();
        const intersecting = window.innerHeight > y + height * threshold &&
            y + height * (1 - threshold) >= 0 &&
            window.innerWidth > x + width * threshold &&
            x + width * (1 - threshold) >= 0;

        if (!visible.current && intersecting && enter) trigger();
        if (visible.current && !intersecting && exit) trigger();

        visible.current = intersecting;
    }

    useEffect(() => {
        update();

        window.addEventListener('scroll', update);
        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        }
    }, []);

    return [trigger, ref];
}