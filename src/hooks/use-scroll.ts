import { useEffect } from "react";
import useLink from "./use-link";

export default function useScroll(restore = 0) {
    const link = useLink(0);

    useEffect(() => {
        const scroll = () => link.set(window.scrollY);
        link.set(window.scrollY, restore);

        window.addEventListener('scroll', scroll);
        return () => window.removeEventListener('scroll', scroll);
    }, []);

    return link;
}