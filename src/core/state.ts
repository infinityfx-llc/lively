import Animator from "./animator";

const registeredAnimators = new Map<string, Animator<any>>();

export function getClosestLayoutGroup() {

}

export function getParentAnimator(id: string, stepsRemoved: number) {
    let parent = registeredAnimators.get(id) || null;

    for (let i = 0; i < stepsRemoved; i++) {
        if (!parent) return null;

        parent = parent.parent;
    }
    
    return parent;
}

export function registerAnimator(id: string, animator: Animator<any>) {
    registeredAnimators.set(id, animator);

    return id;
}

export function unregisterAnimator(id: string) {
    registeredAnimators.delete(id);
}