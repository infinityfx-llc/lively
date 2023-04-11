'use client';

import { useEffect, useRef } from "react";
import useLink from "./use-link";

let audioContext: AudioContext;

export default function useAudio(source: HTMLAudioElement | null, { bands = 8, minFrequency = 100, maxFrequency = 2000 } = {}) {
    const buffer = useRef(new Float32Array(1024));
    const analyzer = useRef<AnalyserNode>();
    const mediaSource = useRef<MediaElementAudioSourceNode>();
    const [link, setLink] = useLink<number[]>([]);

    let frame: number;
    function update() {
        if (!analyzer.current || source?.paused) return;

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

        setLink(arr, 0);

        frame = requestAnimationFrame(update);
    }

    function play() {
        if (audioContext.state === 'suspended') audioContext.resume();
        frame = requestAnimationFrame(update);
    }

    function suspend() {
        cancelAnimationFrame(frame);

        setLink(new Array(bands).fill(0), 0.3);
    }

    useEffect(() => {
        if (!audioContext) audioContext = new AudioContext();
        analyzer.current = new AnalyserNode(audioContext, { fftSize: 2048, smoothingTimeConstant: 0.8 });
        analyzer.current.connect(audioContext.destination);

        if (!mediaSource.current && source) {
            mediaSource.current = audioContext.createMediaElementSource(source);
            mediaSource.current.connect(analyzer.current);

            source.addEventListener('play', play);
            source.addEventListener('pause', suspend);
            source.addEventListener('ended', suspend);
        }

        return () => {
            analyzer.current?.disconnect();
            source?.removeEventListener('play', play);
            source?.removeEventListener('pause', suspend);
            source?.removeEventListener('ended', suspend);
        }
    }, [source]);

    return link;
}