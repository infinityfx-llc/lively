import Animatable from '../animatable';
import { Children, isValidElement } from 'react';
import { MORPH_PROPERTIES } from '../core/globals';
import { getSnapshot, subArray } from '../core/utils/helper';
import { computeMorph } from '../core/utils/interpolation';
import Clip from '../core/clip';

export default class Morph extends Animatable {

    static cascadingProps = ['id'];

    constructor(props) {
        super(props);

        this.animations = {
            default: new Clip({}, { opacity: +props.active, pointerEvents: props.active ? '' : 'none' }),
            unmorph: new Clip({}, { opacity: 0, pointerEvents: 'none' })
        };
        this.properties = subArray(this.props.include, this.props.ignore); // duplicate code (layout group)
        this.uuid = props.id + props.group.toString();
    }

    // active prop needs to propagate from parent Morph component
    shouldComponentUpdate(nextProps) {
        if (this.props.active !== nextProps.active) {
            if (!window.LIVELY_MORPH_TARGETS) window.LIVELY_MORPH_TARGETS = {}; // optimize
            if (!(this.uuid in window.LIVELY_MORPH_TARGETS)) window.LIVELY_MORPH_TARGETS[this.uuid] = [];
            window.LIVELY_MORPH_TARGETS[this.uuid].push(this);
        }

        return true;
    }

    getSnapshotBeforeUpdate(prevProps) {
        if (this.props.active !== prevProps.active && this.props.active) {
            for (const target of window.LIVELY_MORPH_TARGETS[this.uuid]) {
                if (target !== this) return getSnapshot(target.elements[0]); // account for children, get x and y relative to parent and not window
            }
        }

        return null;
    }

    componentDidUpdate(_1, _2, target) {
        super.componentDidUpdate();

        window.LIVELY_MORPH_TARGETS = {};
        if (!target) {
            // this.manager.clear(); // WIP TESTING
            this.manager.initialize(this.animations.unmorph);
            return;
        }

        const self = getSnapshot(this.elements[0]);
        self.opacity = 1;
        self.pointerEvents = '';

        this.manager.play(computeMorph(self, target, this.properties, this.props.duration), { composite: true });
    }

    render() {
        try {
            const child = Children.only(this.props.children);
            return isValidElement(child) ? super.render() : child;
        } catch (err) {
            return this.props.children;
        }
    }

    static defaultProps = {
        ...Animatable.defaultProps,
        id: 0,
        active: false,
        include: MORPH_PROPERTIES, // duplicate code (layout group)
        ignore: [],
        duration: 1
    }

}