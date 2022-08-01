import Link from '../core/link';

export default function useAnimation(initial) {
    const link = Link.create(initial);

    return [link, link.feed];
}