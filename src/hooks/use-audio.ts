'use client';

import { useEffect, useRef } from "react";
import useLink from "./use-link";

/**
 * @returns A tupple of a `React.Ref` to attach to an `Audio` element and an `AnimationLink`.
 */
export default function useAudio({ bands = 8, minFrequency = 100, maxFrequency = 2000, smoothing = 0.7 }: {
    /**
     * Amount of bands and subsequent animation values to divide the audio spectrum in to.
     * 
     * @default 8
     */
    bands?: number;
    /**
     * The minimum audio spectrum frequency in hertz.
     * 
     * @default 100
     */
    minFrequency?: number;
    /**
     * The maximum audio spectrum frequency in hertz.
     * 
     * @default 2000
     */
    maxFrequency?: number;
    /**
     * @default .7
     */
    smoothing?: number;
} = {}) {
    const ref = useRef<HTMLAudioElement & {
        context: AudioContext;
        sourceNode: MediaElementAudioSourceNode;
    }>(null);
    const analyzer = useRef<AnalyserNode>(null);
    const buffer = useRef(new Float32Array(1024));

    const link = useLink<number[]>(new Array(bands).fill(0));

    useEffect(() => {
        const audio = ref.current,
            ctrl = new AbortController();

        if (!audio) return;
        if (!audio.context) {
            audio.context = new AudioContext();
            audio.sourceNode = audio.context.createMediaElementSource(audio);
        }

        if (!analyzer.current) {
            const node = analyzer.current = new AnalyserNode(audio.context, {
                fftSize: 2048,
                smoothingTimeConstant: smoothing
            });

            audio.sourceNode.connect(node);
            node.connect(audio.context.destination);
        }

        let frame: number;
        function update() {
            if (!analyzer.current) return;

            analyzer.current.getFloatFrequencyData(buffer.current);

            const values = new Array(bands);
            const minIndex = Math.floor((minFrequency / 24000) * 1024),
                maxIndex = Math.floor((maxFrequency / 24000) * 1024);

            for (let i = 0; i < bands; i++) {
                const index = minIndex + (maxIndex - minIndex) / bands * i;
                const ratio = index - Math.floor(index);

                const value = buffer.current[Math.floor(index)] * (1 - ratio) +
                    buffer.current[Math.ceil(index)] * ratio;

                values[i] = isNaN(value) ? 0 : Math.max(0, (100 + value) / 70);
            }

            link.set(values, { duration: 0 });

            frame = requestAnimationFrame(update);
        }

        function suspend() {
            cancelAnimationFrame(frame);

            link.set(new Array(bands).fill(0), { duration: .4 });
        }

        audio.addEventListener('play', (e) => {
            if (!audio.context) return;

            if (audio.context.state === 'suspended') audio.context.resume();

            frame = requestAnimationFrame(update);
        }, { signal: ctrl.signal });
        audio.addEventListener('pause', suspend, { signal: ctrl.signal });
        audio.addEventListener('ended', suspend, { signal: ctrl.signal });

        return () => {
            ctrl.abort();
            audio.context.suspend();
            cancelAnimationFrame(frame);
        }
    }, []);

    return [ref, link] as const;
}