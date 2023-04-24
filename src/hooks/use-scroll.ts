import { useEffect } from "react";
import useLink from "./use-link";
import { attachEvent, detachEvent } from "../core/utils";

export default function useScroll() {
    const [link, update] = useLink(0);

    useEffect(() => {
        const scroll = () => update(window.scrollY);
        scroll();

        attachEvent('scroll', scroll);
        return () => detachEvent('scroll', scroll);
    }, []);

    return link;
}