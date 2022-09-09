import Clip from '../core/clip';

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

    isAnimation: val => val instanceof Function && 'use' in val

};

export default Animation;