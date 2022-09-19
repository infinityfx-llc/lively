import { Children, cloneElement, Component, isValidElement } from 'react';
import Animatable from '../animatable';
import { MORPH_PROPERTIES } from '../core/globals';
import { getSnapshot, subArray } from '../core/utils/helper';
import { computeMorph } from '../core/utils/interpolation';

export default class LayoutGroup extends Component {

    constructor(props) {
        super(props);

        this.children = [];
        this.properties = subArray(this.props.include, this.props.exclude);
    }

    getSnapshotBeforeUpdate() {
        const arr = this.children.map(child => {
            const el = child?.elements[0];

            return el ? { data: getSnapshot(el), key: child.props.layoutKey } : null;
        });

        return arr;
    }

    componentDidUpdate(_1, _2, snapshot) {
        for (let i = 0, j = 0; i < snapshot.length; i++, j++) { // WIP
            const child = this.children[j];
            if (!child || !child.elements[0]) continue;

            const prev = snapshot[i];
            if (!prev || child.props.layoutKey !== prev.key) {
                j--;
                continue;
            }

            const next = getSnapshot(child.elements[0]);
            child.manager.play(computeMorph(next, prev.data, this.properties, this.props.duration), { composite: true }); // WIP maybe dont use manager directly
            // implement manager.forceUpdate to update animation without animationFrame
        }
    }

    render() {
        this.childIndex = 0;

        return Children.map(this.props.children, child => {
            if (!isValidElement(child) || !Animatable.isInstance(child)) return child;

            const i = this.childIndex++;
            return cloneElement(child, { ref: el => this.children[i] = el, layoutKey: child.key });
        });
    }

    static defaultProps = {
        include: MORPH_PROPERTIES,
        exclude: []
    }

}