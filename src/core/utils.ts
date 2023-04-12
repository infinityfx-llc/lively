import type { AnimatableProperty, Easing } from "./clip";

const Events: {
    [key: string]: {
        unique: number;
        listeners: {
            [key: number]: (e: Event) => void;
        }
    }
} = {};

export function attachEvent(event: string, callback: (e: any) => void) {
    if (!(event in Events)) {
        Events[event] = { unique: 0, listeners: {} };

        window.addEventListener(event, e => {
            for (const cb of Object.values(Events[event].listeners)) cb(e);
        });
    }

    const e = Events[event];
    (callback as any).EventID = e.unique;
    e.listeners[e.unique++] = callback;
};

export function detachEvent(event: string, callback: (e: any) => void) {
    if (!(event in Events) || !('EventID' in callback)) return;

    delete Events[event][callback.EventID as never];
};

export function merge(...objects: { [key: string]: any }[]) {
    for (let i = 1; i < objects.length; i++) {
        for (const key in objects[i]) {
            if (key in objects[0] && objects[0][key] !== undefined) continue;

            objects[0][key] = objects[i][key];
        }
    }

    return objects[0];
};

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

    remove(index: number) {
        const i = this.map(index);

        if (i >= 0) {
            this.values.splice(i, 1);
            this.indices.splice(i, 1);
            this.size--;
        }
    }

    map(index: number) {
        let start = 0, end = this.size - 1;

        while (start <= end) {
            let mid = (start + end) >>> 1;

            if (this.indices[mid] === index) return mid;

            index < this.indices[mid] ? end = mid - 1 : start = mid + 1;
        }

        return ~start;
    }

    forEach(iterator: (value: T, index: number) => void) {
        this.values.forEach(iterator);
    }

};

export function parseAnimatableProperty(values: (AnimatableProperty | undefined)[], index: number): [number, string | number | undefined] {
    let offset = values.length < 2 ? 1 : Math.round(index / (values.length - 1) * 1000) / 1000,
        value = values[index];

    if (value === null) return [offset, undefined];

    if (typeof value === 'object') {
        return [value.offset || offset, value.set]; // TODO start, end
    } else {
        return [offset, value];
    }
}

let element: HTMLDivElement;

export function createDynamicFrom(prop: string, keyframes: (AnimatableProperty| undefined)[], easing: Easing) {
    const parsed = keyframes.map((_, i) => {
        const [offset, parsed] = parseAnimatableProperty(keyframes, i);

        return { [prop]: parsed, offset };
    });
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