import { AnimationTrigger, LifeCycleTrigger } from "./animator";
import { ClipInitials, ClipKey, ClipKeyframe, ClipKeyframes } from "./clip2";

export const keyframeEpsilon = .0001;

export function serializeTriggers(triggers: {
    [key: string]: AnimationTrigger[] | undefined;
}) {
    const serialized: {
        [key: string]: string;
    } = {};

    for (const key in triggers) serialized[key] = (triggers[key] || []).map(value => value.toString()).join(',');

    return serialized;
}

export function getLifeCycleAnimations<T extends string>(triggers: {
    [key in T]?: AnimationTrigger[];
}) {
    const animations: {
        [key in LifeCycleTrigger]?: T[];
    } = {};

    for (const name in triggers) {
        (['mount', 'unmount'] as const).forEach(trigger => {
            if (triggers[name] && triggers[name].includes(trigger)) {
                if (!(trigger in animations)) animations[trigger] = [];

                animations[trigger]!.push(name);
            }
        });
    }

    return animations;
}

export function transformKeyframeList(list: ClipKeyframe[]) {
    let keyframes = [],
        equal = 0,
        last;

    for (let i = 0; i < list.length; i++) {
        const value = list[i],
            offset = Math.round(i / (list.length - 1) / keyframeEpsilon) * keyframeEpsilon;

        if (value === null) continue;

        const keyframe = typeof value !== 'object' ? { offset, to: value } : value;
        if (!('offset' in keyframe)) keyframe.offset = offset;
        keyframes.push(keyframe as {
            to?: string | number;
            after?: string | number;
            offset: number;
        });

        const current = keyframe.to || keyframe.after;
        if (last === current) equal++;
        last = current;
    }

    return equal === keyframes.length ? null : keyframes;
}

export function addKeyframeEntry(map: Map<number, Keyframe>, offset: number, prop: string, value: string | number) {
    if (!map.has(offset)) map.set(offset, { offset });
    const entry = map.get(offset)!;

    entry[prop] = value;
}

export function parseClipKeyframes(keyframes: ClipKeyframes, initial: ClipInitials) {
    const map = new Map<number, Keyframe>();

    for (const prop in keyframes) {
        const value = keyframes[prop as ClipKey]!;
        const array = Array.isArray(value) ? value : [value];

        if (array.length < 2) array.unshift(initial[prop as ClipKey] ?? null);

        const transformed = transformKeyframeList(array);
        if (!transformed) continue;

        for (let { to, after, offset } of transformed) {
            if (after !== undefined) {
                if (offset === 1) offset -= keyframeEpsilon;

                addKeyframeEntry(map, offset + keyframeEpsilon, prop, after);
            }
            if (to !== undefined) {
                addKeyframeEntry(map, offset, prop, to);
            }
        }
    }

    // @ts-expect-error
    return Array.from(map.values()).sort((a, b) => a.offset - b.offset);
}