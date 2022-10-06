import { useEffect } from 'react';
import { addEventListener, removeEventListener } from '../core/utils/events';
import useLink from './link';

export default function useScroll() {
    const [link, set] = useLink(0);

    useEffect(() => {
        const setScroll = () => set(window.scrollY);
        setScroll();

        // maybe add resize event aswell
        addEventListener('scroll', setScroll);
        return () => removeEventListener('scroll', setScroll);
    }, []);

    return link;
}