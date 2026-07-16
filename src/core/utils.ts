import { captureOwnerStack, isValidElement } from "react";
import { AnimationOptions, AnimationTrigger, LifeCycleTrigger } from "./animator";
import Clip, { ClipConfig, ClipInitials, ClipKey, ClipKeyframe, ClipKeyframes, ClipOptions } from "./clip";
import { AnimateTriggers } from "../animate";
import AnimationLink from "./animation-link";
import { getParentAnimator } from "./state";
import { CorrectionAlignment } from "./track";

const warnings = new Set<string>();

export const keyframeEpsilon = .0001;

export function warnConsoleOnce(id: string, message: string) {
    if (process.env.NODE_ENV === 'production' || warnings.has(id)) return;

    warnings.add(id);

    console.warn(`Warning: ${message} ${captureOwnerStack()}`);
}

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

export function forEachTrigger<T extends string>(triggers: AnimateTriggers<T>, callback: (key: T, triggerList: AnimationTrigger[], options: AnimationOptions[]) => void) {
    for (const key in triggers) {
        if (key === '_livelyId') continue;

        const optionsArray: AnimationOptions[] = [];

        const list = triggers[key]!.map(value => {
            const { on, ...options } = typeof value === 'object' && 'on' in value ? value : { on: value };

            optionsArray.push(options);

            return on;
        });

        callback(key, list, optionsArray);
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

export function getLifeCycleAnimations<T extends string>(triggers: AnimateTriggers<T>) {
    const animations: {
        [key in LifeCycleTrigger]?: [T, AnimationOptions][];
    } = {};

    forEachTrigger(triggers, (key, list, options) => {
        (['mount', 'unmount'] as const).forEach(trigger => {
            const index = list.indexOf(trigger);
            if (index < 0) return;

            if (!(trigger in animations)) animations[trigger] = [];
            animations[trigger]!.push([key, options[index]]);
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

        const { to, after } = keyframe;
        const current = after ?? to;

        if (to === undefined || after === undefined || to === after) {
            if (last === current) equal++;
        }

        last = current;
    }

    return equal === Math.max(keyframes.length - 1, 1) ? null : keyframes;
}

export function addKeyframeEntry(map: Map<number, Keyframe>, offset: number, prop: string, value: string | number) {
    if (!map.has(offset)) map.set(offset, { offset });
    const entry = map.get(offset)!;

    if (prop === 'strokeLength') return entry.strokeDashoffset = 2 - (value as number);
    entry[prop] = value;
}

export function parseClipKeyframes(keyframes: ClipKeyframes, initial: ClipInitials, omitSingularPrimitives: boolean) {
    const map = new Map<number, Keyframe>();

    for (const prop in keyframes) {
        const value = keyframes[prop as ClipKey]!;
        if (value instanceof AnimationLink) continue;
        if (omitSingularPrimitives && typeof value !== 'object' && !(prop in initial)) continue;

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

export function parseIndiviualTransform(value: string, defaultValue = 0) {
    if (!value || value === 'none') return [defaultValue, defaultValue] as const;

    const nums = value.split(/\s+/).map(parseFloat);
    if (nums.length < 2) nums[1] = nums[0] * defaultValue;

    return nums as [number, number];
}

export function parseMatrixTransform(transform: string) {
    const matrix = !transform || transform === 'none' ? undefined : transform.match(/^matrix(?:3d)?\((.+)\)$/)?.[1];
    if (!matrix) return [1, 1, 0, 0] as const;

    const [a, b, c, d, tx, ty] = matrix.split(',').map(parseFloat);

    return [
        Math.sqrt(a * a + b * b),
        Math.sqrt(c * c + d * d),
        tx,
        ty
    ] as const;
}

export function parseFixedOffset(left: string, top: string) {
    const tx = left !== 'auto' ? parseFloat(left) : 0;
    const ty = top !== 'auto' ? parseFloat(top) : 0;

    return [tx + window.scrollX, ty + window.scrollY] as const;
}

function getElementBounds(element: HTMLElement, skipOffsetCalculation: boolean) {
    let x = 0, y = 0, scaleX = 1, scaleY = 1;
    let el: HTMLElement | null = element;

    while (el) {
        const styles = getComputedStyle(el);
        const [msx, msy, mtx, mty] = parseMatrixTransform(styles.transform);
        const [sx, sy] = parseIndiviualTransform(styles.scale, 1);

        scaleX *= msx * sx;
        scaleY *= msy * sy;

        if (!skipOffsetCalculation) {
            const [tx, ty] = parseIndiviualTransform(styles.translate);
            const [ox, oy] = styles.position === 'fixed' ?
                parseFixedOffset(styles.left, styles.top) :
                [el.offsetLeft, el.offsetTop];

            x += mtx + tx + ox;
            y += mty + ty + oy;
        }

        el = el.offsetParent as HTMLElement;
    }

    return { x, y, scaleX, scaleY };
}

export function getLocalBounds(element: HTMLElement, skipOffsetCalculation = false, align: CorrectionAlignment = { x: 'left', y: 'top' }) {
    let parent: HTMLElement | null = element.parentElement;
    while (parent) {
        if (parent.dataset.lively) break;
        parent = parent.parentElement;
    }

    const abs = getElementBounds(element, skipOffsetCalculation);

    if (parent && !skipOffsetCalculation) {
        let { x, y } = getElementBounds(parent, false);

        if (align.x === 'right') x += parent.offsetWidth - element.offsetWidth;
        if (align.x === 'center') x += parent.offsetWidth / 2 - element.offsetWidth / 2;
        if (align.y === 'bottom') y += parent.offsetHeight - element.offsetHeight;
        if (align.y === 'center') y += parent.offsetHeight / 2 - element.offsetHeight / 2;

        abs.x -= x;
        abs.y -= y;
    }

    return {
        scale: [clampLowerBound(abs.scaleX), clampLowerBound(abs.scaleY)] as ScaleTuple,
        width: skipOffsetCalculation ? 0 : element.offsetWidth * abs.scaleX,
        height: skipOffsetCalculation ? 0 : element.offsetHeight * abs.scaleY,
        x: skipOffsetCalculation ? 0 : abs.x + (parent ? 0 : element.offsetWidth * 0.5),
        y: skipOffsetCalculation ? 0 : abs.y + (parent ? 0 : element.offsetHeight * 0.5)
    };
}

export function scaleCorrectRadius(radius: string, scale: ScaleTuple) {
    if (/^\s*$|0px/.test(radius)) return radius;

    const array = radius.split(/\s*\/\s*/);
    if (array.length < 2) array[1] = array[0];

    return array.map((axis, i) => {
        return axis.split(' ').map(radius => {
            return parseFloat(radius) / scale[i] + (radius.match(/[^\d\.]+$/)?.[0] || 'px');
        }).join(' ');
    }).join('/');
}

export function scaleCorrectShadow(shadow: string, scale: ScaleTuple) {
    if (/^\s*$|none/.test(shadow)) return shadow;

    const [color, params, inset] = shadow
        .split(/(?<=px),\s?/)[0]
        .split(/(?<=\))\s|\s(?=inset)/);

    if (!params) return '';

    const [ofx, ofy, blr, spr] = params.split(' ').map(parseFloat);
    const ratio = 1 / Math.max(...scale);

    const shadows = new Array<number[]>(3).fill([
        ofx / scale[0],
        ofy / scale[1],
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

export function correctForParentScale(element: HTMLElement, [tx, ty]: readonly [number, number], [cx, cy]: readonly [number, number], align: CorrectionAlignment) { // doesn't take into account intermediate transform parent scale correction?
    let animator;
    let parent: HTMLElement | null = element;
    while (parent = parent?.parentElement) {
        if (parent.dataset.lively) {
            animator = getParentAnimator(parent.dataset.lively, 0);
            break;
        }
    }

    if (!parent || !animator || !animator.trackList.some(track => track.animations.length || track.correctAfterEnded)) return '';

    const { scale } = getLocalBounds(parent, true);
    const x = 1 / scale[0];
    const y = 1 / scale[1];

    cx = clampLowerBound(cx);
    cy = clampLowerBound(cy);

    const dx = (align.x === 'center' ? 0 : 50 * (1 - cx * x) * (align.x === 'right' ? 1 : -1)) / cx;
    const dy = (align.y === 'center' ? 0 : 50 * (1 - cy * y) * (align.y === 'bottom' ? 1 : -1)) / cy;

    tx *= (x - 1) / cx;
    ty *= (y - 1) / cy;

    return `translate(${tx}px, ${ty}px) translate(${dx}%, ${dy}%) scale(${x}, ${y})`;
}

export function filterRemovedAnimators(children: React.ReactNode, toRemove: Set<string>, prefix: string) {
    let array = Array.isArray(children) ? children : [children],
        hasDynamicKeys = false;

    for (let i = 0; i < array.length; i++) {
        if (!isValidElement(array[i])) continue;

        const { props, key } = array[i] as React.ReactElement<any>;
        const id = prefix + (key !== null ? `_${key}` : i);

        if (key === null) hasDynamicKeys = true;

        if (typeof props.triggers === 'object') {
            props.triggers._livelyId = id;
            toRemove.delete(id);
        }

        filterRemovedAnimators(props.children, toRemove, id);
    }

    return [toRemove, hasDynamicKeys] as const;
}

export function getRemovedAnimators(children: React.ReactNode, removed: Set<string>, prefix: string) {
    const array = Array.isArray(children) ? children : [children];
    const animators: [number, React.ReactElement<any>][] = [];

    for (let i = 0; i < array.length; i++) {
        if (!isValidElement(array[i])) continue;

        const { key } = array[i] as React.ReactElement<any>;
        const id = prefix + (key !== null ? `_${key}` : i);

        if (removed.has(id)) animators.push([i, array[i]]);
    }

    return animators;
}

export function hasMountedMorphTarget(children: React.ReactNode, morphId: string) { // todo: refactor
    const array = Array.isArray(children) ? children : [children];

    for (let i = 0; i < array.length; i++) {
        if (!isValidElement(array[i])) continue;

        const { props } = array[i] as React.ReactElement<any>;

        if (typeof props.morph === 'string' && props.morph === morphId) return true;

        if (hasMountedMorphTarget(props.children, morphId)) return true;
    }

    return false;
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

export function extractAnimationLinks(animate: Clip | ClipOptions, initial: ClipInitials, callback: (key: ClipKey, link: AnimationLink<any>) => void) {
    const links: {
        [key in ClipKey]?: AnimationLink<any>;
    } = {};
    const callbacks: (() => void)[] = [];
    const disposeLinks = () => callbacks.forEach(remove => remove());

    if (!(animate instanceof Clip)) {
        for (const key in animate) {
            let value = animate[key as ClipKey];
            if (typeof value !== 'object' &&
                !(key in ClipConfigKeys) &&
                !(key in initial)) value = new AnimationLink(value);

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