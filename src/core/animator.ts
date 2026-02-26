import { getParentAnimator, registerAnimator } from "./state";

export default class Animator {

    id: string;
    parent: Animator | null = null;
    dependents: Set<Animator> = new Set();
    clips: any;
    tracks: any;
    state: 'unmounted' | 'unmounting' | 'mounted' = 'unmounted';

    constructor(id: string, parentId: string, inherit: boolean | number) {
        this.id = registerAnimator(id, this);

        if (parentId && inherit !== false) {
            this.parent = getParentAnimator(parentId, typeof inherit === 'boolean' ? 0 : inherit);
        }
        if (this.parent) this.parent.addDependent(this);
    }

    addDependent(animator: Animator) {
        this.dependents.add(animator);
    }

    addTrack(element: any) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement)) return;

        // somehow keep staggering ordering
    }

    mount() {

    }

    dispose() {

    }

    getInitial() {
        return {};
    }

    play() {

    }

    pause() {

    }

    stop() {

    }

}