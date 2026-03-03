import { Children, isValidElement } from "react";
import { AnimationTrigger, LifeCycleTrigger } from "./animator";
import { ClipInitials, ClipKey, ClipKeyframe, ClipKeyframes } from "./clip2";

export const keyframeEpsilon = .0001;

export const clampLowerBound = (num: number, precision = 8) => Math.sign(num) * Math.max(Math.abs(num), 1 / Math.pow(10, precision));

export function mergeRefs(...refs: React.Ref<any>[]) {
    return (value: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) ref.current = value;
            if (ref instanceof Function) ref(value);
        });
    };
}

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

export type ScaleTuple = readonly [number, number];

export function scaleCorrectRadius(radius: string, scale: ScaleTuple, previousScale: ScaleTuple) {
    const array = radius.split(/\s*\/\s*/);
    if (array.length < 2) array[1] = array[0];

    return array.map((axis, i) => {
        return axis.split(' ').map(radius => {
            return parseFloat(radius) * previousScale[i] / scale[i] + (radius.match(/[^\d\.]+$/)?.[0] || 'px');
        }).join(' ');
    }).join('/');
}

export function scaleCorrectShadow(shadow: string, scale: ScaleTuple, previousScale: ScaleTuple) {
    const [color, params, inset] = shadow
        .split(/(?<=px),\s?/)[0]
        .split(/(?<=\))\s|\s(?=inset)/);

    if (!params) return '';

    const [ofx, ofy, blr, spr] = params.split(' ').map(parseFloat);
    const ratio = Math.max(...previousScale) / Math.max(...scale);

    const shadows = new Array<number[]>(3).fill([
        ofx * previousScale[0] / scale[0],
        ofy * previousScale[1] / scale[1],
        blr * ratio,
        spr * ratio
    ]);

    if (scale[0] < scale[1]) {
        shadows[1][0] -= 1 / scale[0];
        shadows[2][0] += 1 / scale[0];
    } else {
        shadows[1][1] -= 1 / scale[1];
        shadows[2][1] += 1 / scale[1];
    }

    return shadows.map(val => `${color} ${val.map(val => `${val}px`).join(' ')}${inset ? ' inset' : ''}`).join(', ');
}

export function getRemovedAnimators(children: React.ReactNode, animatorIds: Set<string>) {
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        if ('livelyId' in child) animatorIds.delete(child.livelyId as string);

        getRemovedAnimators((child as React.ReactElement<React.HTMLProps<any>>).props.children, animatorIds);
    });

    return Array.from(animatorIds.values());
}