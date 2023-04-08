'use client';

import { useRef, useState } from "react";
import { AnimatableType } from "../animatable";
import { sleep } from "../core/utils";

export default function useMount(initial: boolean): [React.Ref<AnimatableType>, boolean, (value: boolean) => void] {
    const [mounted, setMounted] = useState(initial);
    const ref = useRef<AnimatableType>(null);

    async function update(value: boolean) {
        const unMount = ref.current?.onUnmount;
        if (value || !unMount) return setMounted(value);

        const duration = ref.current.play(ref.current.onUnmount, {
            reverse: typeof unMount === 'string' ? false : true,
            immediate: true
        });

        await sleep(duration * 1000);

        setMounted(value);
    }

    return [ref, mounted, update];
}