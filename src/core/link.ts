import { ClipConfig } from "./clip";

type Computed<P> = (index: number) => P;

type Computation<T, P> = (value: T, index: number) => P;

export type Link<T> = {
    (index?: number): T;
    <P>(computation: Computation<T, P>): Link<ReturnType<typeof computation>>;
    set(value: T, options?: ClipConfig): void;
    subscribe(callback: (options: ClipConfig) => void): void;
}

const links = new Set<WeakRef<(options: ClipConfig) => void>>();

export function createLink<T, P>(initial: T, computed?: Computed<P>) {
    let internal = {
        value: initial,
        cached: initial,
        subscriptions: new Set() as Set<WeakRef<(options: ClipConfig) => void>>
    };

    const Link: Link<T> = function(arg: any): any {
        if (arg instanceof Function) return createLink(internal.value, (index: number) => arg(Link(), index));

        return computed ? computed(arg || 0) : internal.value;
    }

    Link.set = (value: T, options?: ClipConfig) => {
        internal.value = value;

        links.forEach(link => {
            const observe = link.deref();

            observe ? observe(options || {}) : links.delete(link);
        });
    }

    Link.subscribe = (callback: any) => internal.subscriptions.add(new WeakRef(callback));

    function observe(options: ClipConfig) {
        const current = Link();

        if (current !== internal.cached) {
            internal.cached = current;

            internal.subscriptions.forEach(subscription => {
                const callback = subscription.deref();

                callback ? callback(options) : internal.subscriptions.delete(subscription);
            });
        }
    }

    links.add(new WeakRef(observe));

    return Link;
}

export function isLink<T>(val: any): val is Link<T> {
    return (<Link<T>>val).subscribe !== undefined;
}