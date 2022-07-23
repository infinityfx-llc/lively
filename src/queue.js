import { livelyProperty } from "./utils";

export default class AnimationQueue {

    constructor() {
        this.queue = [];

        this.tick();
    }

    static get() {
        livelyProperty('AnimationQueue', new AnimationQueue());

        return window.Lively.AnimationQueue;
    }

    uuid() {    
        return Math.floor(Math.random() * 1e6).toString(16).padStart('0', 6);
    }

    async tick() {
        const tick = Date.now();

        for (let i = 0; i < this.queue.length + 1; i++) {
            if (this.queue.length === i || this.queue[i].timestamp > tick) {
                this.queue.splice(0, i);
                break;
            }

            this.queue[i].callback();
        }

        requestAnimationFrame(this.tick.bind(this));
    }

    search(item) {
        let l = 0, h = this.queue.length - 1, m, c;

        while (l <= h) {
            m = (l + h) >>> 1;
            c = this.queue[m].timestamp - item.timestamp;

            if (c < 0) {
                l = m + 1;
            } else
            if (c > 0) {
                h = m - 1;
            } else {
                return m;
            }
        }

        return l;
    }

    insert(item) {
        const idx = this.search(item);

        this.queue.splice(idx, 0, item);
    }

    cancel(timeout) {
        const idx = this.search(timeout);
        if (this.queue[idx].id === timeout.id) this.queue.splice(idx, 1);
        delete timeout.cancel;
    }

    delay(callback, seconds) {
        if (!(callback instanceof Function)) return;

        const id = this.uuid();
        const timestamp = Date.now() + seconds * 1000;
        const timeout = { timestamp, id, cancel: () => this.cancel(timeout) };
        this.insert({ callback: () => {
            delete timeout.cancel;
            callback();
        }, timestamp, id });

        return timeout;
    }

    static delay(callback, seconds) {
        return this.get().delay(callback, seconds);
    }

    static sleep(seconds = 1) {
        return new Promise((resolve) => {
            this.delay(resolve, seconds);
        });
    }

}