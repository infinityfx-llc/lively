import { Units } from './utils/convert';
import { getProperty, is, xor } from './utils/helper';
import * as Interpolate from './utils/interpolation';

export default class Track {

    constructor(clip, { reverse = false, repeat = 1, delay = 0, alternate = false } = {}) {
        this.indices = {};
        this.clip = clip;
        this.t = 0;
        this.T = clip.duration * repeat + delay;

        this.reverse = reverse;
        this.delay = delay;
        this.alternate = alternate;

        // this.ended = new Promise(); // WIP

        // events: onend, onpause, onplay
    }

    get(element) {
        let t = this.t - this.delay;
        const isAlt = this.alternate && Math.floor(t / this.clip.duration) % 2 == 1;
        t = t % this.clip.duration;
        t = xor(this.reverse, isAlt) ? this.clip.duration - t : t;

        const properties = {};

        if (this.t >= this.delay) {
            for (const prop in this.clip.properties) {
                let val = this.clip.properties[prop];

                if (is.function(val)) {
                    val = this.clip.convert(val(t, this.clip.duration), prop);
                    val = Units.toBase(val, prop, element);
                } else {
                    if (!(prop in this.indices)) this.indices[prop] = this.reverse ? val.length - 1 : 0; // reset indices when end of animation (maybe?)

                    const inc = this.reverse ? -1 : 1;
                    let i = this.indices[prop];

                    let from = val[i];
                    let to = val[i + inc];
                    let mainVal = from.set, isMarker;

                    if (this.reverse ? to.time >= t : to.time <= t) {
                        this.indices[prop] = i = i + inc;

                        const keys = ['start', 'end'];
                        const s = keys[+!this.reverse], e = keys[+this.reverse];
                        if (s in from || e in to) {
                            mainVal = s in from ? from[s] : to[e];
                            isMarker = true;
                        } else {
                            from = val[i];
                            to = val[i + inc];
                        }
                    }

                    if (is.null(mainVal)) mainVal = getProperty(element, prop);
                    mainVal = Units.toBase(mainVal, prop, element);

                    if (isMarker) {
                        val = Units.toBase(mainVal, prop, element);
                    } else {
                        let scndVal = is.null(to.set) ? getProperty(element, prop) : to.set;
                        scndVal = Units.toBase(scndVal, prop, element);

                        const func = Interpolate[to.interpolate] || Interpolate.linear;
                        val = Interpolate.interpolate(mainVal, scndVal, (t - from.time) / (to.time - from.time), func);
                    }
                }

                properties[prop] = val;
            }
        }

        return properties;
    }

    step(dt) {
        this.t += dt;

        return this.t >= this.T;
    }

}