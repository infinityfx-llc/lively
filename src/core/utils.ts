import type { AnimatableKeyframe } from "./clip";

type SharedKeys<T, P> = keyof Omit<T | P, keyof (Omit<T, keyof P> & Omit<P, keyof T>)>;

type MergedMaps<T, P> = T & P & { [K in SharedKeys<T, P>]: MergedPair<T[K], P[K]> };

type MergedPair<T, P> = [T, P] extends [{ [key: string]: unknown; }, { [key: string]: unknown; }] ? MergedMaps<T, P> : T & P;

type Merged<T extends [...any]> = T extends [infer L, ...infer R] ? MergedPair<L, Merged<R>> : unknown;

export function merge<T extends { [key: string]: any; }[]>(...objects: T) {
    for (let i = 1; i < objects.length; i++) {
        for (const key in objects[i]) {
            if (key in objects[0] && objects[0][key] !== undefined) continue;

            objects[0][key] = objects[i][key];
        }
    }

    return objects[0] as Merged<T>;
};

export function pick<T extends { [key: string]: any; }, K extends keyof T>(map: T, keys: K[]) {
    const picked = {} as { [key in K]: T[K] };

    for (const key of keys) picked[key] = map[key];

    return picked;
}

export function combineRefs(...refs: (React.Ref<any> | undefined)[]) {
    return (el: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) (ref as React.RefObject<any>).current = el;
            if (ref instanceof Function) ref(el);
        });
    };
}

export const lengthToOffset = (val: any) => 1 - parseFloat(val.toString());

export class IndexedMap<K, V> extends Map<K, V> {

    stack: V[] = [];

    set(key: K, value: V) {
        this.stack.push(value);

        return super.set(key, value);
    }

    delete(key: K) {
        const i = this.stack.indexOf(this.get(key) as V);
        if (i >= 0) this.stack.splice(i, 1);

        return super.delete(key);
    }

}

type AnimatableObjectProperty = { value?: string | number; after?: string | number; offset: number; };

export function distributeAnimatableKeyframes(prop: string, keyframes: AnimatableObjectProperty[], map: { [key: number]: Keyframe; } = {}) {
    const set = (offset: number, value: string | number) => {
        const key = offset * 10000,
            isStroke = prop === 'strokeLength';

        if (!(key in map)) map[key] = { offset };

        map[key][isStroke ? 'strokeDashoffset' : prop] = isStroke ? lengthToOffset(value) : value;
    };

    for (let i = 0; i < keyframes.length; i++) {
        let { offset, value, after } = keyframes[i];

        if (value !== undefined) {
            if (after !== undefined && offset === 1) offset = offset - 0.0001;
            set(offset, value);
        }
        if (after !== undefined) {
            offset = Math.min(offset + 0.0001, 1);
            set(offset, after);
        }
    }

    return map;
}

export function normalizeAnimatableKeyframes(keyframes: (AnimatableKeyframe | undefined)[]) {
    let equal = 0, match: any;

    for (let i = 0; i < keyframes.length; i++) {
        let keyframe = keyframes[i],
            offset = keyframes.length < 2 ? 1 : Math.round(i / (keyframes.length - 1) * 10000) / 10000;
        if (i === 0) match = keyframe;

        if (keyframe && typeof keyframe === 'object') {
            if (!('offset' in keyframe)) keyframe.offset = offset;
        } else {
            if (keyframe === match) equal++;
            keyframes[i] = { offset, value: keyframe !== null ? keyframe : undefined };
        }
    }

    return equal < 2 || equal !== keyframes.length;
}