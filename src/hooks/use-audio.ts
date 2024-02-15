'use client';

import { useEffect, useRef } from "react";
import useLink, { Link } from "./use-link";

let audioContext: AudioContext;

export default function useAudio({ bands = 8, minFrequency = 100, maxFrequency = 2000, smoothing = 0.7 } = {}): [React.MutableRefObject<HTMLAudioElement | null>, Link<number[]>] {
    const buffer = useRef(new Float32Array(1024));
    const analyzer = useRef<AnalyserNode>();
    const source = useRef<MediaElementAudioSourceNode>();
    const ref = useRef<HTMLAudioElement | null>(null);
    const link = useLink<number[]>(new Array(8).fill(0));

    let frame: number;
    function update() {
        if (!analyzer.current) return;

        analyzer.current.getFloatFrequencyData(buffer.current);
        const arr = link() as number[];
        const lower = Math.floor((minFrequency / 24000) * 1024);
        const upper = Math.floor((maxFrequency / 24000) * 1024);

        for (let i = 0; i < bands; i++) {
            const offset = lower + (upper - lower) / bands * i;
            const li = Math.floor(offset), ui = Math.ceil(offset);
            const di = offset - li;
            const val = buffer.current[li] * (1 - di) + buffer.current[ui] * di;

            arr[i] = Math.max(0, (100 + val) / 70);
        }

        link.set(arr, 0);

        frame = requestAnimationFrame(update);
    }

    function play() {
        if (audioContext.state === 'suspended') audioContext.resume();
        frame = requestAnimationFrame(update);
    }

    function suspend() {
        cancelAnimationFrame(frame);

        link.set(new Array(bands).fill(0), 0.3);
    }

    useEffect(() => {
        const audio = ref.current;

        if (!audio) return;
        if (!audioContext) audioContext = new AudioContext();
        if (!analyzer.current) analyzer.current = new AnalyserNode(audioContext, { fftSize: 2048, smoothingTimeConstant: smoothing });
        if (!source.current) source.current = audioContext.createMediaElementSource(audio);

        analyzer.current.connect(audioContext.destination);
        source.current.connect(analyzer.current);
        audio.addEventListener('play', play);
        audio.addEventListener('pause', suspend);
        audio.addEventListener('ended', suspend);

        return () => {
            analyzer.current?.disconnect();
            source.current?.disconnect();
            audio.removeEventListener('play', play);
            audio.removeEventListener('pause', suspend);
            audio.removeEventListener('ended', suspend);
        }
    }, []);

    return [ref, link];
}