import Animator from "./animator";

const registeredAnimators = new Map<string, Animator<any>>();

const registeredLayoutGroups = new Map<string, {
    animators: Set<string>;
    skipInitialMount: boolean;
}>();

const morphGroups = new Map<string, Set<Animator<any>>>();

export function getParentAnimator(id: string, stepsRemoved: number) {
    let parent = registeredAnimators.get(id) || null;

    for (let i = 0; i < stepsRemoved; i++) {
        if (!parent) return null;

        parent = parent.parent;
    }

    return parent;
}

export function isRegistered(id: string) {
    return registeredAnimators.has(id);
}

export function registerAnimator(id: string, animator: Animator<any>) {
    registeredAnimators.set(id, animator);
}

export function unregisterAnimator(id: string) {
    registeredAnimators.delete(id);
}

export function registerLayoutGroup(id: string, skipInitialMount: boolean) {
    const data = registeredLayoutGroups.get(id) || {
        animators: new Set<string>(),
        skipInitialMount
    };

    registeredLayoutGroups.set(id, data);

    return data;
}


export function unregisterLayoutGroup(id: string) {
    registeredLayoutGroups.delete(id);
}

export function registerToLayoutGroup(layoutId: string, id: string) {
    const layoutGroup = registeredLayoutGroups.get(layoutId);

    if (layoutGroup) {
        layoutGroup.animators.add(id);
        return layoutGroup.skipInitialMount;
    }

    return false;
}

export function unregisterFromLayoutGroup(layoutId: string, id: string) {
    const layoutGroup = registeredLayoutGroups.get(layoutId);

    if (layoutGroup) layoutGroup.animators.delete(id);
}

export function forEachAnimator(ids: Set<string>, callback: (animator: Animator<any>) => void) {
    ids.forEach(id => {
        const animator = registeredAnimators.get(id);
        if (animator) callback(animator);
    });
}

export function registerAsMorph(morphId: string, animator: Animator<any>) {
    const group = morphGroups.get(morphId) || new Set();
    group.add(animator);

    morphGroups.set(morphId, group);
}

export function getMorphTarget(morphId: string, receiverId: string) {
    const targets = morphGroups.get(morphId);
    if (!targets) return null;

    for (const animator of targets) {
        if (animator && animator.id !== receiverId && animator.state === 'unmounted') return animator;
    }

    return null;
}

export function deleteMorphTarget(morphId: string, animator: Animator<any>, delay = 0) {
    const group = morphGroups.get(morphId);
    if (group && delay) return setTimeout(() => group.delete(animator));
    if (group) group.delete(animator);

    return 0;
}