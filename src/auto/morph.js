import Animatable from '../animatable';
import { isValidElement } from 'react';
import { MORPH_PROPERTIES } from '../core/globals';
import { getSnapshot, is, subArray } from '../core/utils/helper';
import { computeMorph } from '../core/utils/interpolation';
import Clip from '../core/clip';

const TARGETS = {};

export default class Morph extends Animatable {

    static cascadingProps = ['id', 'duration'];

    constructor(props) {
        super(props);

        this.animations = {
            default: new Clip({}, { opacity: +props.active, pointerEvents: props.active ? '' : 'none' }),
            unmorph: new Clip({}, { opacity: 0, pointerEvents: 'none' })
        };
        this.properties = subArray(this.props.include, this.props.exclude); // duplicate code (layout group)
        this.uuid = (props.id || 0).toString() + (props.index || 0) + props.group; // TESTING
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.active !== nextProps.active) {
            this.uuid in TARGETS ? TARGETS[this.uuid].push(this) : TARGETS[this.uuid] = [this];
        }

        return this.props.active !== nextProps.active; // WIP
    }

    getSnapshotBeforeUpdate(prevProps) {
        if (this.props.active !== prevProps.active && this.props.active) {
            for (const target of TARGETS[this.uuid]) {
                if (target !== this) return getSnapshot(target.elements[0], this.props.group);
            }
        }

        return null;
    }

    componentDidUpdate(_1, _2, target) {
        super.componentDidUpdate();

        TARGETS[this.uuid] = [];
        if (!target) {
            // this.manager.clear(); // WIP TESTING
            this.manager.initialize(this.animations.unmorph);
            return;
        }

        const self = getSnapshot(this.elements[0], this.props.group);
        self.opacity = 1; // OPTIMIZE
        self.pointerEvents = '';

        this.manager.play(computeMorph(self, target, this.properties, this.props.duration), { composite: true });
    }

    render() {
        let children = this.props.children;
        if (is.array(children)) {
            if (children.length > 1) return children;
            children = children[0];
        }

        return isValidElement(children) ? super.render() : children;
    }

    static defaultProps = {
        ...Animatable.defaultProps,
        cascade: 0,
        active: false,
        include: MORPH_PROPERTIES, // duplicate code (layout group)
        exclude: [],
    } // implement transition to nothing prop for disappearing elements.

}