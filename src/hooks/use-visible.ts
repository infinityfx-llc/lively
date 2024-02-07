import { useEffect, useRef } from "react";
import useTrigger, { Trigger } from "./use-trigger";

export default function useVisible<T extends Element = any>({ enter = true, exit = false, threshold = 0.5 } = {}): [Trigger, React.Ref<T>] {
    const ref = useRef<T>(null);
    const visible = useRef(false);
    const trigger = useTrigger();

    useEffect(() => {
        function update(reset: boolean) {
            if (!ref.current) return;

            const { x, y, width, height } = ref.current.getBoundingClientRect();
            const intersecting = (x + y + width + height) > 0 &&
                window.innerHeight > y + height * threshold &&
                y + height * (1 - threshold) >= 0 &&
                window.innerWidth > x + width * threshold &&
                x + width * (1 - threshold) >= 0;

            if (reset) visible.current = false;
            if ((!visible.current && intersecting && enter)
                || (visible.current && !intersecting && exit)) trigger(reset ? 1 : undefined);

            visible.current = intersecting;
        }

        const scroll = () => update(false);
        const resize = () => update(true);

        scroll();

        window.addEventListener('scroll', scroll);
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('scroll', scroll);
            window.removeEventListener('resize', resize);
        }
    }, [trigger]);

    return [trigger, ref];
}