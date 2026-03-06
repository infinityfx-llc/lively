'use client';

import { useEffect, useRef } from "react";
import useLink from "./use-link";

export default function useAudio({ bands = 8, minFrequency = 100, maxFrequency = 2000, smoothing = 0.7 } = {}) {
    const ref = useRef<HTMLAudioElement>(null);
    const context = useRef<AudioContext>(null);
    const analyzer = useRef<AnalyserNode>(null);
    const buffer = useRef(new Float32Array(1024));

    const link = useLink<number[]>(new Array(bands).fill(0));

    useEffect(() => {
        const audio = ref.current,
            ctrl = new AbortController();

        if (!audio) return;
        if (!context.current) {
            const ctx = context.current = new AudioContext();
            const node = analyzer.current = new AnalyserNode(ctx, {
                fftSize: 2048,
                smoothingTimeConstant: smoothing
            });
            ctx.createMediaElementSource(audio).connect(node);
            node.connect(ctx.destination);
        }

        let frame: number;
        function update() {
            if (!analyzer.current) return;

            analyzer.current.getFloatFrequencyData(buffer.current);

            const values = link.get();
            const minIndex = Math.floor((minFrequency / 24000) * 1024),
                maxIndex = Math.floor((maxFrequency / 24000) * 1024);

            for (let i = 0; i < bands; i++) {
                const index = minIndex + (maxIndex - minIndex) / bands * i;
                const ratio = index - Math.floor(index);

                const value = buffer.current[Math.floor(index)] * (1 - ratio) +
                    buffer.current[Math.ceil(index)] * ratio;

                values[i] = Math.max(0, (100 + value) / 70);
            }

            link.set(values, { duration: 0 });

            frame = requestAnimationFrame(update);
        }

        function suspend() {
            cancelAnimationFrame(frame);

            link.set(link.get().fill(0));
        }

        audio.addEventListener('play', () => {
            if (!context.current) return;

            if (context.current.state === 'suspended') context.current.resume();

            frame = requestAnimationFrame(update);
        }, { signal: ctrl.signal });
        audio.addEventListener('pause', suspend, { signal: ctrl.signal });
        audio.addEventListener('ended', suspend, { signal: ctrl.signal });

        return () => {
            ctrl.abort();
            context.current?.close();
            cancelAnimationFrame(frame);
        }
    }, []);

    return [ref, link] as const;
}