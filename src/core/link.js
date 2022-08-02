export default function Link(transform = val => val) {
    if (!transform.isBound) {
        transform.isBound = true;
        return Link.construct(this, transform);
    }

    return typeof window !== 'undefined' ? transform(this.value) : null;
};

Link.construct = (context, ...args) => {
    const link = Link.bind(context, ...args);

    link.set = val => context.value = val;

    link.link = cb => {
        context.linked.push(cb);

        return link;
    };

    link.feed = val => {
        context.value = val;

        for (const cb of context.linked) {
            cb();
        }
    };

    return link;
};

Link.create = function (initial) {
    return Link.construct({ value: initial, linked: [] });
};

Link.isLink = val => val instanceof Function && 'link' in val;