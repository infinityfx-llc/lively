import type { AnimatableProperty, Easing } from "./clip";

let element: HTMLDivElement;

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

// MOVE THIS TO UTILS