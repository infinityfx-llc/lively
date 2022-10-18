import { DEFAULT_OBJECTS, MERGE_FUNCTIONS } from './globals';
import { Aliases } from './utils/convert';
import { calculateTransform, getProperty, isColor, isEmpty, merge, mergeProperties } from './utils/helper';

export default class Timeline {

    constructor(element, culling, layout) {
        this.element = element;
        this.tracks = [];
        this.queue = [];

        this.playing = true;
        this.culling = culling;
        this.layout = layout;
        this.transforms = ['translate', 'rotate', 'scale', 'skew'];
    }

    purge() {
        if (!('cache' in this.element)) {
            this.element.cache = {
                strokeDasharray: 1,
                borderRadius: getProperty(this.element, 'borderRadius'), // dont apply this on cache hydration
                webkitBackfaceVisibility: 'hidden'
            };

            for (let i = 0; i < this.element.style.length; i++) {
                const prop = this.element.style[i];
                this.element.cache[prop] = this.element.style[prop];
            }
        }

        this.element.style = {};
        for (const prop in this.element.cache) {
            this.element.style[prop] = this.element.cache[prop];
        }

        this.channel = null;
    }

    clear() {
        this.tracks = [];
        this.queue = [];
    }

    add(track, { immediate = false, composite = true } = {}) {
        if (immediate) this.clear();

        composite || !this.tracks.length ? this.tracks.push(track) : this.queue.push(track);
    }

    remove(track) {
        this.tracks.splice(this.tracks.indexOf(track), 1);

        if (!this.tracks.length && this.queue.length) this.tracks.push(this.queue.shift());
    }

    step(dt) {
        if (!this.playing) return;

        const props = this.element.correction ? { scale: DEFAULT_OBJECTS.scale } : {}; // OPTIMIZE
        const len = this.tracks.length + (+!this.channel.isEmpty); // OPTIMIZE

        for (let i = 0; i < len; i++) {
            const track = this.tracks[i] || this.channel;

            mergeProperties(props, track.get(this.element, this.culling));

            if (track.step(dt)) this.remove(track);
        }

        this.apply(this.element, props);
    }

    apply(el, properties) {
        if (isEmpty(properties)) return;

        let transform = [];

        for (let prop in properties) {
            let val = properties[prop];

            if (prop == 'scale') {
                if (this.layout) {
                    const correction = { x: [1 / val.x[0], '%'], y: [1 / val.y[0], '%'] };
                    for (const child of el.children) child.correction = correction;

                    const r = properties.borderRadius || el.cache.borderRadius; // WIP
                    delete properties.borderRadius;

                    el.style.borderRadius = `${r[0] / val.x[0]}${r[1]} / ${r[0] / val.y[0]}${r[1]}`;
                    // potentially correct other things as well
                }

                if (el.correction) val = merge(val, el.correction, MERGE_FUNCTIONS.scale);
            }

            const idx = this.transforms.indexOf(prop);
            if (idx >= 0) {
                transform[idx] = val;
                continue;
            }

            prop = Aliases[prop] || prop;

            if (isColor(val)) {
                el.style[prop] = `rgba(${val.r[0]}, ${val.g[0]}, ${val.b[0]}, ${val.a[0]})`;
            } else {
                el.style[prop] = (Aliases[prop] || Aliases.default)(val);
            }
        }

        transform = calculateTransform(el, transform, this.transforms);
        if (transform.length) el.style.transform = transform;
    }

    initialize(clip, force) {
        if (this.channel && !force) return;

        this.apply(this.element, { ...clip.initials });

        this.channel = clip.channel;
    }

}