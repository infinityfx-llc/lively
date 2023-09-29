import type { AnimatableKeyframe, Easing } from "./clip";

// type SharedKeys<T, P> = keyof Omit<T | P, keyof (Omit<T, keyof P> & Omit<P, keyof T>)>;

// type MergeObjects<T, P> = T & P & { [K in SharedKeys<T, P>]: Merged<T[K], P[K]> };

// type Merged<T, P> = [T, P] extends [{ [key: string]: unknown }, { [key: string]: unknown }] ? MergeObjects<T, P> : T & P;

export function merge(...objects: { [key: string]: any; }[]) {
    for (let i = 1; i < objects.length; i++) {
        for (const key in objects[i]) {
            if (key in objects[0] && objects[0][key] !== undefined) continue;

            objects[0][key] = objects[i][key];
        }
    }

    return objects[0];
};

export function combineRefs(...refs: React.Ref<any>[]) {
    return (el: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) (ref as React.MutableRefObject<any>).current = el;
            if (ref instanceof Function) ref(el);
        });
    };
}

export const lengthToOffset = (val: any) => 1 - parseFloat(val.toString());

export class IndexedList<T = any> {

    values: T[] = [];
    indices: number[] = [];
    size: number = 0;

    has(index: number) {
        const i = this.map(index);

        return i >= 0;
    }

    add(index: number, value: T) {
        const i = this.map(index);

        if (i < 0) {
            this.values.splice(~i, 0, value);
            this.indices.splice(~i, 0, index);
            this.size++;
        } else {
            this.values[i] = value;
        }
    }

    // remove(index: number) {
    //     const i = this.map(index);

    //     if (i >= 0) {
    //         this.values.splice(i, 1);
    //         this.indices.splice(i, 1);
    //         this.size--;
    //     }
    // }

    map(index: number) {
        let start = 0, end = this.size - 1;

        while (start <= end) {
            let mid = (start + end) >>> 1;

            if (this.indices[mid] === index) return mid;

            index < this.indices[mid] ? end = mid - 1 : start = mid + 1;
        }

        return ~start;
    }

    // forEach(iterator: (value: T, index: number) => void) {
    //     this.values.forEach(iterator);
    // }

};

type AnimatableObjectProperty = { value?: string | number; after?: string | number; offset: number; };

export function distributeAnimatableKeyframes(prop: string, keyframes: AnimatableObjectProperty[], map: { [key: number]: Keyframe; } = {}) {
    const set = (offset: number, value: string | number) => {
        const key = offset * 10000;

        if (!(key in map)) map[key] = { offset };
        map[key][prop] = prop === 'strokeDashoffset' ? lengthToOffset(value) : value;
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

let element: HTMLDivElement;

export function createDynamicFrom(prop: string, keyframes: AnimatableObjectProperty[], easing: Easing) { // strokeLength gets double converted when this is used in action with .set() (causing 1 - val to be inverted)
    const parsed = Object.values(distributeAnimatableKeyframes(prop, keyframes));
    let animation: Animation;

    return (progress: number) => {
        if (!element) {
            element = document.createElement('div');
            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            document.body.appendChild(element);
        }

        if (!animation) animation = element.animate(parsed, { easing, duration: 1000, fill: 'forwards' });
        animation.currentTime = 1000 * progress;

        return getComputedStyle(element)[prop as never];
    };
}