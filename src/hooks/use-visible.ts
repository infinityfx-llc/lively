'use client';

import { useEffect, useRef, useState } from "react";

export default function useVisible<T extends Element = any>(threshold = 0.5): [boolean, React.Ref<T>] {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(entries => {
            setVisible(entries[0].isIntersecting);
        }, { threshold });
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref]);

    return [visible, ref];
}