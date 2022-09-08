import { is } from './utils/helper';

const Link = { // Allow for interpolation as well

    create: (initial) => {
        const state = { value: initial, transform: val => val, duration: 0 }; // duration WIP

        const link = function (args) {
            if (is.function(args)) return state.transform = args, link;

            return state.transform(state.value);
        };
    
        link.set = (val, duration = 0) => {
            state.value = val;
            state.duration = duration;
        };
    
        return link;
    },

    isInstance: val => is.function(val) && is.function(val.set)

};

export default Link;