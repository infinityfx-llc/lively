import Track from './track';

export default class Channel extends Track {

    constructor(convert) {
        super({
            duration: Infinity,
            properties: {},
            convert
        });

        // this.previous = {};
    }

    add(prop, link) {
        this.clip.properties[prop] = link;
    }

    // get(element) {
    //     const properties = {};

    //     for (const prop in this.clip.properties) {
    //         let val = this.clip.properties[prop];
    //         let scndVal = this.previous[prop] || { value: null, t: 0 };
    //         const t = (this.t - scndVal.t) / val.duration;

    //         const func = interpolation.linear; //interpolation[to.interpolate] || interpolation.linear;

    //         val = this.clip.convert(val(t, this.clip.duration), prop);
    //         val = unit.toBase(val, prop, element);

    //         if (is.null(scndVal.value)) scndVal = unit.toBase(utils.getProperty(element, prop), prop, element);

    //         properties[prop] = interpolation.interpolate(scndVal, val, t, func);

    //         this.previous[prop] = { value: val, t: this.t };
    //     }

    //     return properties;
    // }

}