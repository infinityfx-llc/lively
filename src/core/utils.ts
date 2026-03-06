import { Children, isValidElement } from "react";
import { AnimationOptions, AnimationTrigger, LifeCycleTrigger } from "./animator";
import Clip, { ClipConfig, ClipInitials, ClipKey, ClipKeyframe, ClipKeyframes, ClipOptions } from "./clip";
import { AnimateProps, AnimateTriggers } from "../animate";
import AnimationLink from "./animation-link";

export const keyframeEpsilon = .0001;

export const clampLowerBound = (num: number, precision = 8) => Math.sign(num) * Math.max(Math.abs(num), 1 / Math.pow(10, precision));

export const asArray = (value: number | number[]) => Array.isArray(value) ? value : [value];

export function mergeRefs(...refs: React.Ref<any>[]) {
    return (value: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) ref.current = value;
            if (ref instanceof Function) ref(value);
        });
    };
}

export function forEachTrigger<T extends string>(triggers: AnimateTriggers<T>, callback: (key: T, triggerList: AnimationTrigger[], options: AnimationOptions) => void) {
    for (const key in triggers) {
        const entry = triggers[key];
        if (typeof entry !== 'object') continue;

        const { on, ...options } = 'on' in entry ? entry : { on: entry };

        callback(key, on, options);
    }
}

export function serializeTriggers<T extends string>(triggers: AnimateTriggers<T>) {
    const serialized: {
        [key: string]: string;
    } = {};

    forEachTrigger(triggers, (key, list) => {
        serialized[key] = list.map(value => value.toString()).join(',');
    });

    return serialized;
}

export function getLifeCycleAnimations<T extends string>(triggers: AnimateTriggers<T>) {
    const animations: {
        [key in LifeCycleTrigger]?: T[];
    } = {};

    forEachTrigger(triggers, (key, list) => {
        (['mount', 'unmount'] as const).forEach(trigger => {
            if (list.includes(trigger)) {
                if (!(trigger in animations)) animations[trigger] = [];

                animations[trigger]!.push(key);
            }
        });
    });

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
        if (value instanceof AnimationLink) continue;

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

export function filterRemovedAnimators(children: React.ReactNode, animatorIds: Set<string>) {
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        const { props } = child as React.ReactElement<AnimateProps<any>>;
        if (typeof props.triggers === 'object' && '_livelyId' in props.triggers) {
            animatorIds.delete(props.triggers._livelyId as any);
        }

        filterRemovedAnimators(props.children, animatorIds);
    });

    return animatorIds;
}

export const ClipConfigKeys: {
    [key in keyof Required<ClipConfig>]: number;
} = {
    duration: 0,
    delay: 1,
    repeat: 2,
    alternate: 3,
    reverse: 4,
    easing: 5,
    composite: 6
};

export function activateAnimationLinks(animate: Clip | ClipOptions, callback: (key: ClipKey, link: AnimationLink<any>) => void) {
    const links: {
        [key in ClipKey]?: AnimationLink<any>;
    } = {};
    const callbacks: (() => void)[] = [];
    const disposeAnimationLinks = () => callbacks.forEach(remove => remove());

    if (animate instanceof Clip) return [links, disposeAnimationLinks] as const;

    for (const key in animate) {
        const value = animate[key as keyof ClipOptions];
        if (value instanceof AnimationLink) {
            callbacks.push(value.on('change', () => callback(key as ClipKey, value)));

            callback(key as ClipKey, value); // duration needs to be 0!
        }

        if (typeof value !== 'object' && !(key in ClipConfigKeys)) {
            const link = new AnimationLink(value);

            link.on('change', () => callback(key as ClipKey, link));

            links[key as ClipKey] = link;
        }
    }

    return [links, disposeAnimationLinks] as const;
}