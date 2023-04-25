import { useCallback, useRef } from "react";
import useLink, { Link } from "./use-link";

let audioContext: AudioContext;

export default function useAudio({ bands = 8, minFrequency = 100, maxFrequency = 2000, smoothing = 0.7 } = {}): [(source: HTMLAudioElement) => void, Link<number[]>] {
    const buffer = useRef(new Float32Array(1024));
    const analyzer = useRef<AnalyserNode>();
    const [link, setLink] = useLink<number[]>(new Array(8).fill(0));

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

    const ref = useCallback((source: HTMLAudioElement | null) => {
        if (!source) return;
        if (!audioContext) audioContext = new AudioContext();

        if (!analyzer.current) {
            analyzer.current = new AnalyserNode(audioContext, { fftSize: 2048, smoothingTimeConstant: smoothing });
            analyzer.current.connect(audioContext.destination);
        }

        if (!('mediaSource' in source)) {
            (source as any).mediaSource = audioContext.createMediaElementSource(source);
            (source as any).mediaSource.connect(analyzer.current);
            source.addEventListener('play', play);
            source.addEventListener('pause', suspend);
            source.addEventListener('ended', suspend);
        }
    }, []);

    return [ref, link];
}