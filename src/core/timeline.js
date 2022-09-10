import { TRANSFORMS } from './globals';
import { Alias, objToStr } from './utils/convert';
import { is, mergeProperties } from './utils/helper';

export default class Timeline {

    constructor(element, useCulling = true) {
        this.element = element;
        this.tracks = [];
        this.queue = [];

        this.playing = true;
        this.culling = useCulling;
    }

    purge() {
        if (!('cache' in this.element)) {
            this.element.cache = {};

            for (let i = 0; i < this.element.style.length; i++) {
                const prop = this.element.style[i];
                this.element.cache[prop] = this.element.style[prop];
            }

            this.element.cache.strokeDasharray = 1;
        }

        this.element.style = {};
        for (const prop in this.element.cache) {
            this.element.style[prop] = this.element.cache[prop];
        }
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

        let props = {};
        for (let i = 0; i < this.tracks.length + 1; i++) {
            const track = this.tracks[i] || this.channel; // LOOK INTO optimal placement for clip.isEmpty check (for channels)
            if (!track.clip.isEmpty && (!this.culling || is.visible(this.element))) mergeProperties(props, track.get(this.element));

            if (track.step(dt)) this.remove(track);
        }

        this.apply(this.element, props);
    }

    apply(el, properties) {
        if (is.empty(properties)) return;

        const transform = [];

        for (const prop in properties) {
            let val = properties[prop];

            if (TRANSFORMS.includes(prop)) {
                val = is.object(val) ? `${prop}(${objToStr(val, ', ', ['x', 'y'])})` : `${prop}(${val.join('')})`;

                transform.push(val); // use aliases (and maybe allow for 3d transforms)
                continue;
            }

            const styles = Alias[prop] || [prop];
            for (const style of styles) {
                if (is.color(val)) {
                    el.style[style] = `rgba(${val.r[0]}, ${val.g[0]}, ${val.b[0]}, ${val.a[0]})`;
                } else {
                    el.style[style] = style in Alias ? Alias[style](val) : is.null(val[1]) ? val[0] : val.join('');
                }
            }
        }

        if (transform.length) el.style.transform = transform.join(' ');
    }

    initialize(clip) {
        this.apply(this.element, clip.initials);

        this.channel = clip.channel;
    }

}