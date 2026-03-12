import { isValidElement } from "react";
import { AnimationOptions, AnimationTrigger, LifeCycleTrigger } from "./animator";
import Clip, { ClipConfig, ClipInitials, ClipKey, ClipKeyframe, ClipKeyframes, ClipOptions } from "./clip";
import { AnimateTriggers } from "../animate";
import AnimationLink from "./animation-link";

export const keyframeEpsilon = .0001;

export function clampLowerBound(num: number, precision = 8) {
    const lowerBound = 1 / Math.pow(10, precision);

    if (isNaN(num)) return lowerBound;

    return (num < 0 ? -1 : 1) * Math.max(Math.abs(num), lowerBound);
}

export const asArray = (value: number | number[]) => Array.isArray(value) ? value : [value];

export function mergeRefs(...refs: React.Ref<any>[]) {
    return (value: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) ref.current = value;
            if (ref instanceof Function) ref(value);
        });
    };
}

export function mergeStyles(...stylesList: (ClipInitials | undefined)[]) {
    const merged: React.CSSProperties = {};

    for (const styles of stylesList) Object.assign(merged, styles);
    if ('strokeLength' in merged) {
        merged.strokeDashoffset = 2 - (merged.strokeLength as number);
        delete merged.strokeLength;
    }
    if ('strokeDashoffset' in merged) merged.strokeDasharray = 2;

    return merged;
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
        [key: string]: any[];
    } = {};

    forEachTrigger(triggers, (key, list) => {
        serialized[key] = list;
    });

    return serialized;
}

export function shouldTrigger(previous: any[], current: any[]) {
    previous.forEach((prev, i) => {
        if (prev !== current[i] && current[i] !== false) return true;
    });

    return false;
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

    if (prop === 'strokeLength') return entry.strokeDashoffset = 2 - (value as number);
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
    if (/^\s*$|0px/.test(radius)) return radius;

    const array = radius.split(/\s*\/\s*/);
    if (array.length < 2) array[1] = array[0];

    return array.map((axis, i) => {
        return axis.split(' ').map(radius => {
            return parseFloat(radius) * previousScale[i] / scale[i] + (radius.match(/[^\d\.]+$/)?.[0] || 'px');
        }).join(' ');
    }).join('/');
}

export function scaleCorrectShadow(shadow: string, scale: ScaleTuple, previousScale: ScaleTuple) {
    if (/^\s*$|none/.test(shadow)) return shadow;

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

export function correctForParentScale(element: HTMLElement) {
    let parent: HTMLElement | null = element;
    while (parent = parent?.parentElement) { // <- clean up code
        if (parent.dataset.lively) break;
    }

    if (!parent?.dataset.lively) return;

    const { width, height } = parent.getBoundingClientRect();
    const x = clampLowerBound(width / parent.offsetWidth),
        y = clampLowerBound(height / parent.offsetHeight);

    const l = element.offsetLeft,
        t = element.offsetTop,
        w = element.offsetWidth,
        h = element.offsetHeight;

    // todo:
    // const [tx, ty] = getComputedStyle(child).translate.split(' ').map(parseFloat);

    // element.style.transform = `translate(${-tx || 0}px, ${-ty || 0}px) scale(${1 / x}, ${1 / y}) translate(${l * (1 - x) + w / 2 * (1 - x) + (tx || 0)}px, ${t * (1 - y) + h / 2 * (1 - y) + (ty || 0)}px)`;
    element.style.transform = `scale(${1 / x}, ${1 / y})`;
}

export function filterRemovedAnimators(children: React.ReactNode, toRemove: Set<string>, prefix = '_la') {
    const array = Array.isArray(children) ? children : [children];

    for (let i = 0; i < array.length; i++) {
        if (!isValidElement(array[i])) continue;

        const { props, key } = array[i] as React.ReactElement<any>;
        const id = prefix + (key !== null ? `${key}_` : i);

        if (typeof props.triggers === 'object') {
            props.triggers._livelyId = id;
            toRemove.delete(id);
        }

        filterRemovedAnimators(props.children, toRemove, id);
    }

    return toRemove;
}

export function getRemovedAnimators(children: React.ReactNode, removed: Set<string>) {
    const array = Array.isArray(children) ? children : [children];
    const animators: [number, React.ReactElement<any>][] = [];

    for (let i = 0; i < array.length; i++) {
        if (!isValidElement(array[i])) continue;

        const { key } = array[i] as React.ReactElement<any>;
        const id = '_la' + (key !== null ? `${key}_` : i);

        if (removed.has(id)) animators.push([i, array[i]]);
    }

    return animators;
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

export function extractAnimationLinks(animate: Clip | ClipOptions, callback: (key: ClipKey, link: AnimationLink<any>) => void) {
    const links: {
        [key in ClipKey]?: AnimationLink<any>;
    } = {};
    const callbacks: (() => void)[] = [];
    const disposeLinks = () => callbacks.forEach(remove => remove());

    if (!(animate instanceof Clip)) {
        for (const key in animate) {
            let value = animate[key as ClipKey];
            if (typeof value !== 'object' && !(key in ClipConfigKeys)) value = new AnimationLink(value);

            if (value instanceof AnimationLink) {
                callbacks.push(value.on('change', () => callback(key as ClipKey, value)));

                links[key as ClipKey] = value;
            }
        }
    }

    return [links, disposeLinks] as const;
}

export function getInitialStyleFromLinks(links: {
    [key in ClipKey]?: AnimationLink<any>;
}, index: number) {
    const styles: ClipInitials = {};

    for (const key in links) {
        styles[key as ClipKey] = links[key as ClipKey]!.get(index);
    }

    return styles;
}