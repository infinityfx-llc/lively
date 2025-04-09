'use client';

import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import type { TransitionOptions } from "../core/track";
import { Groups } from "./morph";

type Node = {
    nodes: Node[];
    node: React.ReactNode;
    key: string;
};

function traverseTree(tree: Node | Node[], callback: (node: Node, index: number[]) => any, partialIndex: number[] = []) {
    const array = 'nodes' in tree ? tree.nodes : tree;

    for (let i = 0; i < array.length; i++) {
        const index = [...partialIndex, i];

        let returnValue = callback(array[i], index);
        if (!returnValue) returnValue = traverseTree(array[i].nodes, callback, index);

        if (returnValue) return returnValue;
    }
}

// find a node tree index based on a component key
function findIndex(tree: Node[], key: string): number[] | null {
    return traverseTree(tree, (node, index) => {
        if (node.key === key) return index;
    }) || null;
}

// get a node from a node tree based on an index
function getNode(tree: Node[], index: number[]): Node | undefined {
    let node = tree[index[0]];

    for (let i = 1; i < index.length; i++) {
        if (!node) break;

        node = node.nodes[index[i]];
    }

    return node;
}

// delete/replace/insert a node into a node tree based on an index
function spliceNode(tree: Node[], index: number[], deleteCount: number, insert?: Node) {
    const i = index[index.length - 1];
    const nodes = index.length > 1 ? getNode(tree, index.slice(0, -1))?.nodes : tree;

    if (nodes) insert ? nodes.splice(i, deleteCount, insert) : nodes.splice(i, deleteCount);
}

// compare a node tree with a react component tree
// and take note of new components that are mounting
function compareTree({
    tree,
    nodes,
    mounting,
    partialIndex = [],
    keys = new Set(),
    parent = ['', 0]
}: {
    tree: Node[];
    nodes: React.ReactNode;
    mounting: Map<string, {
        node: React.ReactNode;
        index: number[];
    }>;
    partialIndex?: number[];
    keys?: Set<string>;
    parent?: [string, number];
}) {
    Children.forEach(nodes, (child, i) => {
        const isElement = isValidElement(child);
        const hasElements = isElement && (Array.isArray((child as React.ReactElement<any>).props.children) || isValidElement((child as React.ReactElement<any>).props.children));
        const isValidLively = isElement && (child.type as any).isLively && 'id' in (child as React.ReactElement<any>).props;
        const isCachable = ((isElement && (child as React.ReactElement<any>).props.cachable) || [0]).length;

        const index = [...partialIndex, i];
        const node = hasElements && !(child.type as any).isLively ?
            cloneElement(child, undefined, []) :
            child;

        const [pkey, poffset] = parent;
        const key = isValidLively ? (child as React.ReactElement<any>).props.id : `$l.${pkey ? pkey + '.' : ''}${index.slice(-poffset).join('')}`;

        const renderedIndex = findIndex(tree, key);
        const target = renderedIndex ? getNode(tree, renderedIndex) : undefined;

        if (!target || (!isValidLively && !target.key.startsWith('$l.'))) {
            mounting.set(key, {
                node,
                index
            });
        } else {
            target.node = node;
        }

        if (hasElements && isCachable) compareTree({
            tree,
            nodes: (child as React.ReactElement<any>).props.children,
            mounting,
            partialIndex: index,
            keys,
            parent: isValidLively ?
                [key, 1] :
                poffset ?
                    [pkey, poffset + 1] :
                    undefined
        });

        keys.add(key);
    });

    return keys;
}

// convert a node tree to a react component tree
function renderTree(tree: Node[]): React.ReactNode {
    const array = tree.map(node => {
        if (!isValidElement(node.node)) return node.node;

        return node.nodes.length ?
            cloneElement(node.node, { key: node.key }, renderTree(node.nodes)) :
            cloneElement(node.node, { key: node.key })
    });

    return array.length > 1 ? array : array[0];
}

/**
 * Animate layout changes or unmounts.
 * 
 * @see {@link https://lively.infinityfx.dev/docs/components/layout-group}
 */
export default function LayoutGroup({ children, transition, initialMount = true }: {
    children: React.ReactNode;
    transition?: Omit<TransitionOptions, 'reverse'>;
    /**
     * Whether to play mount mount animations on first render
     * 
     * @default true
     */
    initialMount?: boolean;
}) {
    const preventMount = useRef(!initialMount);
    const ref = useRef<AnimatableType | null>(null);
    const [_, forceUpdate] = useState({});

    const rendered = useRef<Node[]>([]);
    const mounting = useRef(new Map<string, {
        node: React.ReactNode;
        index: number[];
    }>());

    const timeout = useRef<any>(undefined);
    const unmountDelay = useRef(0);
    const unmounting = useRef<Set<string>>(new Set());

    // get keys of current render passes' children
    // and register any newly mounted nodes
    const keys = compareTree({
        tree: rendered.current,
        nodes: children,
        mounting: mounting.current
    });

    // filter out newly mounted nodes that aren't animatables
    mounting.current.forEach((_, key) => {
        if (!keys.has(key)) mounting.current.delete(key);
    });

    // register any nodes that have unmounted compared to the currently rendered nodes
    traverseTree(rendered.current, node => {
        if (!keys.has(node.key)) unmounting.current.add(node.key);
    });

    if (unmounting.current.size && ref.current) {

        // loop over nodes to check for nodes that need to be unmounted
        for (const child of ref.current.children) {
            const id = child.current?.id as string,
                isUnmounting = unmounting.current.has(id);

            if (!child.current) continue;

            // if node remounted during unmount animation, then cancel the unmounting
            // and replay mount animation
            if (isUnmounting && keys.has(id)) {
                unmounting.current.delete(id);

                child.current.trigger('mount', { immediate: true });
                child.current.timeline.mounted = true;

                continue;
            }

            // if node needs to be unmounted and is animatable, try to play unmount animation and register animation duration
            if (isUnmounting && child.current.timeline.mounted) {
                const ends = Date.now() + child.current.trigger('unmount', { immediate: true }) * 1000;
                unmountDelay.current = Math.max(unmountDelay.current, ends);

                if (child.current.group) {
                    const morph = Groups[child.current.group].get(child.current.timeline);

                    if (morph) morph.state = 'unmounted';
                }

                child.current.timeline.mounted = false;
            }
        }

        const delay = unmountDelay.current - Date.now();
        clearTimeout(timeout.current);

        // removes unmounted nodes from the rendered nodes tree
        const afterUnmount = (update: boolean = true) => {
            unmounting.current.forEach(key => {
                const index = findIndex(rendered.current, key);
                if (index) spliceNode(rendered.current, index, 1);
            });
            unmounting.current.clear();

            if (update) forceUpdate({});
        }

        if (delay > 0) {
            timeout.current = setTimeout(afterUnmount, delay);
        } else {
            afterUnmount(false);
        }
    }

    // only mount new nodes when no old nodes need to be unmounted
    if (!unmounting.current.size && mounting.current.size) { // maybe do this simultanously with unmount (requires unmounts to happen with position absolute..)
        mounting.current.forEach(({ node, index }, key) => {
            spliceNode(rendered.current, index, 0, {
                key,
                node,
                nodes: []
            });
        });
        mounting.current.clear();
    }

    // observe any changes inbetween renders
    useLayoutEffect(() => {
        if (!ref.current) return;

        let child: React.RefObject<AnimatableType<any> | null> | undefined,
            children = ref.current.children.slice();

        // loop over all animatable children
        while (child = children.pop()) {
            if (preventMount.current && child.current) child.current.timeline.mounted = true;

            // if child can't be compared to the rendered tree or should not adaptively animate, then skip this child
            if (!child.current?.id ||
                !child.current.timeline.mounted ||
                !child.current.adaptive ||
                findIndex(rendered.current, child.current.id) === null) continue;

            // else we transition between the old and new layout of this child
            child.current.timeline.transition(undefined, transition);
            children.push(...child.current.children);
        }

        preventMount.current = false;
    });

    return <Animatable ref={ref} passthrough cachable={[]}>
        {renderTree(rendered.current)}
    </Animatable>;
}