import { useEffect } from "react";
import useLink from "./use-link";

export default function useScroll() {
    const [link, update] = useLink(0);

    useEffect(() => {
        const scroll = () => update(window.scrollY);
        scroll();

        window.addEventListener('scroll', scroll);
        return () => window.removeEventListener('scroll', scroll);
    }, []);

    return link;
}