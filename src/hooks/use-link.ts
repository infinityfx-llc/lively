import { useRef } from "react";
import { createLink } from "../core/link";

export default function useLink<T = any>(initial: T) {
    const link = useRef(createLink(initial));

    return link.current;
}