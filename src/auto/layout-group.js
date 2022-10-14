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

    shouldComponentUpdate() {
        this.snapshots = this.children.map(child => {
            const el = child?.elements[0];

            return el ? { snapshot: getSnapshot(el), key: child.props.layoutKey } : {};
        });

        return true;
    }

    componentDidUpdate() {
        for (let i = 0, j = 0; i < this.snapshots.length; i++, j++) {
            const child = this.children[j];
            if (!child?.elements[0]) continue;

            if (child.props.layoutKey !== this.snapshots[i].key) {
                j--;
                continue;
            }

            child.manager.play(
                computeMorph(getSnapshot(child.elements[0]), this.snapshots[i].snapshot, this.properties, this.props.duration),
                { composite: true }
            );
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