import React, { useLayoutEffect, useRef } from "react";

export default function LayoutGroup({ children }: {
    children: React.ReactNode;
    skipInitialMount?: boolean;
}) {
    const content = useRef(children);

    useLayoutEffect(() => {

    });

    return content.current;
}