import { useEffect } from "react";
import useLink from "./use-link";

export default function useScroll() {
    const link = useLink(0);

    useEffect(() => {
        const scroll = () => link.set(window.scrollY);
        scroll();

        window.addEventListener('scroll', scroll);
        return () => window.removeEventListener('scroll', scroll);
    }, []);

    return link;
}