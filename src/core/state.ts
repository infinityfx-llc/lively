import Animator from "./animator";
import type Track from "./track";

const registeredAnimators = new Map<string, Animator<any>>();

export function getAnimator(id: string) {
    return registeredAnimators.get(id);
}

const morphGroups = new Map<string, Set<string>>();

export function getParentAnimator(id: string, stepsRemoved: number) {
    let parent = registeredAnimators.get(id) || null;

    for (let i = 0; i < stepsRemoved; i++) {
        if (!parent) return null;

        parent = parent.parent;
    }

    return parent;
}

let globalFrame = 0;

function globalTick() {
    forEachTrack(track => track.uncorrect());
    forEachTrack((track, { correction }) => track.measure(correction));
    forEachTrack(track => track.correct());

    globalFrame = requestAnimationFrame(globalTick);
}

export function registerAnimator(id: string, animator: Animator<any>) {
    registeredAnimators.set(id, animator);

    if (!globalFrame && typeof window !== 'undefined') globalFrame = requestAnimationFrame(globalTick);
}

export function unregisterAnimator(id: string) {
    registeredAnimators.delete(id);

    if (registeredAnimators.size === 0 && globalFrame) {
        cancelAnimationFrame(globalFrame);
        globalFrame = 0;
    }
}

export function forEachTrack(callback: (track: Track, animator: Animator<any>) => void) {
    for (const animator of registeredAnimators.values()) {
        if (animator.paused || animator.state !== 'mounted') continue;

        animator.trackList.forEach(track => callback(track, animator));
    }
}

export function forEachAnimator(ids: Set<string>, callback: (animator: Animator<any>) => void) {
    ids.forEach(id => {
        const animator = registeredAnimators.get(id);
        if (animator) callback(animator);
    });
}

export function registerAsMorph(morphId: string, id: string) {
    const group = morphGroups.get(morphId) || new Set();
    group.add(id);

    morphGroups.set(morphId, group);
}

export function getMorphTarget(morphId: string, receiverId: string) {
    const targets = morphGroups.get(morphId);
    if (!targets) return null;

    for (const id of targets) {
        const animator = registeredAnimators.get(id);
        if (animator && animator.id !== receiverId && animator.state !== 'mounted') return animator;
    }

    return null;
}

export function deleteMorphTarget(morphId: string, id: string) {
    const group = morphGroups.get(morphId);
    if (group) group.delete(id);

    return 0;
}