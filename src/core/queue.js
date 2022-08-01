import { livelyProperty } from './utils/helper';

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
            const item = this.queue[i];
            if (this.queue.length === i || item.timestamp > tick) {
                this.queue.splice(0, i);
                break;
            }

            item.callback();
            delete item.cancel;
            delete item.store[item.id + item.timestamp];
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
        let idx = this.search(timeout);
        while (idx > 0 && this.queue[idx].timestamp >= timeout.timestamp) idx--;
        while (idx < this.queue.length && this.queue[idx].timestamp <= timeout.timestamp) {
            if (this.queue[idx].id === timeout.id) {
                this.queue.splice(idx, 1);
                break;
            }
            idx++;
        }

        delete timeout.cancel;
    }

    static cancelAll(store) {
        for (const key in store) {
            store[key].cancel();
            delete store[key];
        }
    }

    delay(callback, seconds, store = {}) {
        if (!(callback instanceof Function)) return;

        const timeout = {
            timestamp: Date.now() + seconds * 1000, 
            id: this.uuid(),
            cancel: () => this.cancel(timeout),
            callback,
            store
        };
        this.insert(timeout);
        store[timeout.id + timeout.timestamp] = timeout;

        return timeout;
    }

    static delay(callback, seconds, store) {
        return this.get().delay(callback, seconds, store);
    }

    static sleep(seconds = 1) {
        return new Promise((resolve) => {
            this.delay(resolve, seconds);
        });
    }

}