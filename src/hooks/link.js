import Link from '../core/link';

export default function useLink(initial) {
    const link = Link.create(initial);

    return [link, link.set];
}