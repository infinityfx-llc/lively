import Clip from '../core/clip';
import { isFunc } from '../core/utils/helper';

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

    isInstance: val => isFunc(val) && isFunc(val.use)

};

export default Animation;