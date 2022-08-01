import { useEffect } from 'react';
import Link from '../core/link';
import { addEventListener, removeEventListener } from '../core/utils/helper';

export default function useScroll() {
    const link = Link.create(0);

    useEffect(() => {
        const set = () => link.feed(window.scrollY);
        link.set(window.scrollY);

        // maybe add resize event aswell
        addEventListener('scroll', set);
        return () => removeEventListener('scroll', set);
    }, []);

    return link;
}