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
            offset = i / (list.length - 1); // should round to some precision

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
    const entry = map.get(offset) || { offset };

    entry[prop] = value;

    map.set(offset, entry); // inefficient
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
                if (offset === 1) offset -= 0.0001;

                addKeyframeEntry(map, offset + 0.0001, prop, after);
            }
            if (to !== undefined) {
                addKeyframeEntry(map, offset, prop, to);
            }
        }
    }

    // @ts-expect-error
    return Array.from(map.values()).sort((a, b) => a.offset - b.offset);
}