import { useRef } from 'react';
import Link from '../core/link';

export default function useLink(initial) {
    const link = useRef(Link.create(initial));

    return [link.current, link.current.set];
}