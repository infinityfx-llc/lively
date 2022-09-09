import { TRANSFORMS } from './globals';
import { objToStr } from './utils/convert';
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
        this.element.style = {};
        this.element.style.strokeDasharray = 1;
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
            const track = this.tracks[i] || this.channel;
            if (track && (!this.culling || is.visible(this.element))) mergeProperties(props, track.get(this.element));

            if (track.step(dt)) this.remove(track);
        }

        this.apply(this.element, props);
    }

    apply(el, properties) {
        if (is.empty(properties)) return;

        const transform = [];

        for (const prop in properties) {
            let val = properties[prop];

            if (prop === 'origin') { // OPTIMIZE
                el.style.transformOrigin = `${val.x * 100}% ${val.y * 100}%`;
            } else
                if (prop === 'length') {
                    el.style.strokeDashoffset = 1 - val[0];
                } else
                    if (prop === 'active') {
                        el.style.display = val[0] ? '' : 'none';
                    } else
                        if (prop === 'interact') {
                            el.style.pointerEvents = val[0] ? 'all' : 'none';
                        } else
                            if (prop === 'clip') {
                                el.style.clipPath = `inset(${objToStr(val, ['top', 'right', 'bottom', 'left'])})`;
                                el.style.webkitClipPath = el.style.clipPath;
                            } else
                                if (TRANSFORMS.includes(prop)) {
                                    val = is.object(val) ? `${prop}(${objToStr(val, ['x', 'y'])})` : `${prop}(${val.join('')})`;

                                    transform.push(val); // use aliases (and maybe allow for 3d transforms)
                                } else
                                    if (is.object(val) && 'r' in val) {
                                        el.style[prop] = `rgba(${val.r[0]}, ${val.g[0]}, ${val.b[0]}, ${val.a[0]})`;
                                    } else {
                                        el.style[prop] = is.null(val[1]) ? val[0] : val[0] + val[1];
                                    }
        }

        if (transform.length) el.style.transform = transform.join(' ');
    }

    initialize(clip) {
        this.apply(this.element, clip.initials);

        this.channel = clip.channel; // Maybe allow for array of channels?
    }

}