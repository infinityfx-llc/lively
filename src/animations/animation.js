import Clip from '../core/clip';
import { is } from '../core/utils/helper';

const Animation = {

    create: function (getProperties) {
        const animation = function (options = {}) {
            animation.use = animation.use.bind(animation, options);

            return animation;
        };

        animation.use = function (options = {}) {
            const [properties, initial] = getProperties(options);
            return new Clip(properties, initial);
        }

        return animation;
    },

    isInstance: val => is.function(val) && is.function(val.use)

};

export default Animation;