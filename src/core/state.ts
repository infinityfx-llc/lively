import Animator from "./animator";

const registeredAnimators = new Map<string, Animator<any>>();

const registeredLayoutGroups = new Map<string, {
    animators: Set<string>;
}>();

export function getParentAnimator(id: string, stepsRemoved: number) {
    let parent = registeredAnimators.get(id) || null;

    for (let i = 0; i < stepsRemoved; i++) {
        if (!parent) return null;

        parent = parent.parent;
    }

    return parent;
}

export function getAnimator(id: string) {
    return registeredAnimators.get(id) || null;
}

export function registerAnimator(id: string, animator: Animator<any>) {
    registeredAnimators.set(id, animator);

    return id;
}

export function unregisterAnimator(id: string) {
    registeredAnimators.delete(id);
}

export function registerLayoutGroup(id: string) {
    const data = registeredLayoutGroups.get(id) || {
        animators: new Set<string>()
    };

    registeredLayoutGroups.set(id, data);

    return data;
}


export function unregisterLayoutGroup(id: string) {
    registeredLayoutGroups.delete(id);
}

export function registerToLayoutGroup(layoutId: string, id: string) {
    const layoutGroup = registeredLayoutGroups.get(layoutId);

    if (layoutGroup) layoutGroup.animators.add(id);
}

export function unregisterFromLayoutGroup(layoutId: string, id: string) {
    const layoutGroup = registeredLayoutGroups.get(layoutId);

    if (layoutGroup) layoutGroup.animators.delete(id);
}

export function forEachAnimator(ids: Set<string>, callback: (animator: Animator<any>) => void) {
    ids.forEach(id => callback(registeredAnimators.get(id)!));
}