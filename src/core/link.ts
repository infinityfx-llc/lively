import { ClipConfig } from "./clip";

type Computed<P> = (index: number) => P;

export type Computation<T, P> = (value: T, index: number) => P;

type LinkCallback = (options: ClipConfig) => void;

export type Link<T> = {
    (index?: number): T;
    <P>(computation: Computation<T, P>): Link<ReturnType<typeof computation>>;
    set(value: T, options?: ClipConfig): void;
    subscribe(callback: LinkCallback): void;
    unsubscribe(callback: LinkCallback): void;
}

const links = new Set<{
    key: WeakRef<any>;
    observe: LinkCallback;
}>();

export function createLink<T, P>(initial: T, computed?: Computed<P>) {
    let internal = {
        value: initial,
        cached: initial,
        subscriptions: new Set() as Set<LinkCallback>
    };

    const Link: Link<T> = function (arg: any): any {
        if (arg instanceof Function) return createLink(internal.value, (index: number) => arg(Link(), index));

        return computed ? computed(arg || 0) : internal.value;
    }

    Link.set = (value: T, options?: ClipConfig) => {
        internal.value = value;

        links.forEach(link => { // not very fast...
            if (!link.key.deref()) return links.delete(link);

            link.observe(options || {});
        });
    }

    Link.subscribe = (callback: LinkCallback) => internal.subscriptions.add(callback);

    Link.unsubscribe = (callback: LinkCallback) => internal.subscriptions.delete(callback);

    function observe(options: ClipConfig) {
        const current = Link();

        if (current !== internal.cached) {
            internal.cached = current;

            internal.subscriptions.forEach(subscription => subscription(options));
        }
    }

    links.add({
        key: new WeakRef(Link),
        observe
    });

    return Link;
}

export function isLink<T>(val: any): val is Link<T> {
    return (<Link<T>>val).subscribe !== undefined;
}