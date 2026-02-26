const registeredAnimators = new Map();

export function getClosestLayoutGroup() {

}

export function getParentAnimator(id: string, stepsRemoved: number) {
    let parent = registeredAnimators.get(id);

    for (let i = 0; i < stepsRemoved; i++) {
        if (!parent) return null;

        parent = parent.parent;
    }
    
    return parent;
}

export function registerAnimator(id: string, animator: any) {
    registeredAnimators.set(id, animator);

    return id;
}