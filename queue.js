export default class AnimationQueue {

    constructor() {
        this.queue = [];

        this.tick();
    }

    static get() {
        if (!('UITools' in window)) window.UITools = {};
        if (!('AnimationLoop' in window.UITools)) window.UITools.AnimationQueue = new AnimationQueue();

        return window.UITools.AnimationQueue;
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

    delay(callback, seconds) {
        if (!(callback instanceof Function)) return;

        this.insert({ callback, timestamp: Date.now() + seconds * 1000 });
    }

    static async delay(callback, seconds) {
        return this.get().delay(callback, seconds);
    }

}