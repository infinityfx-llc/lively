import { is } from './utils/helper';

const Link = {

    bind: (f, context) => {
        f.origin = f.origin || f;
        const bound = (...args) => f.origin.call(context, ...args);
        bound.origin = f.origin;

        return bound;
    },

    create: (initial) => {
        const link = Link.bind(function (args) {
            if (is.function(args)) {
                const clone = Link.bind(link, { transform: args });
                clone.set = link.set;
                clone.internal = link.internal;

                return clone;
            }

            return this.transform(link.internal.value);
        }, { transform: val => val });
    
        link.set = (val, duration = 0) => {
            link.internal.value = val;
            link.internal.duration = duration;
            link.internal.t = null;
        };

        link.internal = { value: initial, duration: 0 };
    
        return link;
    },

    isInstance: val => is.function(val) && is.function(val.set)

};

export default Link;