import Action from "./action";

export default class Track {

    element: HTMLElement;
    playing: number = 0;
    active: Action[] = [];
    queue: Action[] = [];
    onupdate: (() => void) | null = null;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    push(action: Action) {
        this.active.push(action);
        this.playing++;

        action.onfinish = this.next.bind(this);
    }

    enqueue(action: Action) {
        this.queue.push(action);
    }

    next() {
        this.onupdate?.();

        if (this.playing-- > 0) return;

        this.active = this.queue.length ? this.queue.splice(0, 1) : [];
        this.active.forEach(action => action.play());
    }

    clear() {
        this.active.forEach(action => action.remove());
        this.active = [];
        this.queue = [];
    }

    pause() {
        for (const action of this.active) action.pause();
    }

    play() {
        for (const action of this.active) action.play();
    }

    step() {
        for (const action of this.active) action.step();
    }

}