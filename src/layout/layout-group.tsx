'use client';

import { Children, cloneElement, isValidElement, useRef, useState } from "react";
import Animatable, { AnimatableType } from "../animatable";
import useMountEffect from "../hooks/use-mount-effect";
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

function findIndex(tree: Node[], key: string): number[] | null {
    return traverseTree(tree, (node, index) => {
        if (node.key === key) return index;
    }) || null;
}

function getNode(tree: Node[], index: number[]): Node | undefined {
    let node = tree[index[0]];

    for (let i = 1; i < index.length; i++) {
        if (!node) break;

        node = node.nodes[index[i]];
    }

    return node;
}

function spliceNode(tree: Node[], index: number[], deleteCount: number, insert?: Node) {
    const i = index[index.length - 1];
    const nodes = index.length > 1 ? getNode(tree, index.slice(0, -1))?.nodes : tree;

    if (nodes) insert ? nodes.splice(i, deleteCount, insert) : nodes.splice(i, deleteCount);
}

function compareTree({
    tree,
    nodes,
    mounting,
    partialIndex = [],
    keys = new Set()
}: {
    tree: Node[];
    nodes: React.ReactNode;
    mounting: Map<string, {
        node: React.ReactNode;
        index: number[];
    }>;
    partialIndex?: number[];
    keys?: Set<string>;
}) {
    Children.forEach(nodes, (child, i) => {
        const isElement = isValidElement(child);
        const hasElements = isElement && (Array.isArray((child as React.ReactElement<any>).props.children) || isValidElement((child as React.ReactElement<any>).props.children));
        const isLively = isElement && (child.type as any).isLively && 'id' in (child as React.ReactElement<any>).props;

        const index = [...partialIndex, i];
        const node = hasElements && !isLively ?
            cloneElement(child, undefined, []) :
            child;

        const key = isLively ? (child as React.ReactElement<any>).props.id : '$l.' + index.join('');

        if (!isLively) {
            const target = getNode(tree, index);

            if (target && target.key.startsWith('$l.')) {
                target.node = node;
            } else {
                mounting.set(key, {
                    node,
                    index
                });
            }
        } else {
            const renderedIndex = findIndex(tree, key);

            if (renderedIndex === null) {
                mounting.set(key, {
                    node,
                    index
                });
            } else {
                const target = getNode(tree, renderedIndex);
                if (target) target.node = node;
            }
        }

        if (hasElements && !isLively) compareTree({
            tree,
            nodes: (child as React.ReactElement<any>).props.children,
            mounting,
            partialIndex: index,
            keys
        });

        keys.add(key);
    });

    return keys;
}

function renderTree(tree: Node[]): React.ReactNode {
    return tree.map(node => {
        if (!isValidElement(node.node)) return node.node;

        return node.nodes.length ?
            cloneElement(node.node, { key: node.key }, renderTree(node.nodes)) :
            cloneElement(node.node, { key: node.key })
    });
}

export default function LayoutGroup({ children, transition }: {
    children: React.ReactNode;
    transition?: Omit<TransitionOptions, 'reverse'>;
}) {
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

    const keys = compareTree({
        tree: rendered.current,
        nodes: children,
        mounting: mounting.current
    });

    mounting.current.forEach((_, key) => {
        if (!keys.has(key)) mounting.current.delete(key);
    });

    traverseTree(rendered.current, node => {
        if (!keys.has(node.key)) unmounting.current.add(node.key);
    });

    if (unmounting.current.size && ref.current) {

        for (const child of ref.current.children) {
            const id = child.current?.id as string,
                isUnmounting = unmounting.current.has(id);

            if (!child.current) continue;

            if (isUnmounting && keys.has(id)) {
                child.current.timeline.mounted = true;

                unmounting.current.delete(id);
            }

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

    useMountEffect(() => {
        if (!ref.current) return;

        for (const child of ref.current.children) {
            if (!child.current?.id ||
                !child.current.timeline.mounted ||
                !child.current.adaptive ||
                findIndex(rendered.current, child.current.id) === null) continue;

            child.current.timeline.transition(undefined, transition);
        }
    });

    return <Animatable ref={ref} passthrough cachable={[]}>
        {renderTree(rendered.current)}
    </Animatable>;
}