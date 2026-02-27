import { ClipInitials, ClipKey, ClipKeyframe, ClipKeyframes } from "./clip2";

export function serializeTriggers(triggers: {
    [key: string]: any[] | undefined; // todo
}) {
    const serialized: {
        [key: string]: string;
    } = {};

    for (const key in triggers) serialized[key] = (triggers[key] || []).map(value => value.toString()).join(',');

    return serialized;
}

export function transformKeyframeList(list: ClipKeyframe[]) {
    let keyframes = [],
        equal = 0,
        last;

    for (let i = 0; i < list.length; i++) {
        const value = list[i],
            offset = i / (list.length - 1);

        if (value === null) continue;

        const keyframe = typeof value !== 'object' ? { offset, to: value } : value;
        if (!('offset' in keyframe)) keyframe.offset = offset;
        keyframes.push(keyframe);

        const current = keyframe.to || keyframe.after;
        if (last === current) equal++;
        last = current;
    }

    return equal === keyframes.length ? null : keyframes;
}

export function parseClipKeyframes(keyframes: ClipKeyframes, initial: ClipInitials) {
    for (const prop in keyframes) {
        const value = keyframes[prop as ClipKey]!;
        const array = Array.isArray(value) ? value : [value];

        if (array.length < 2) array.unshift(initial[prop as ClipKey] ?? null);

        const transformed = transformKeyframeList(array);
    }
}