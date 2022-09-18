import React from 'react';

interface LayoutGroupProps {

    /**
     * @default ['translate', 'scale', 'rotate', 'opacity', 'borderRadius', 'backgroundColor', 'color', 'zIndex', 'pointerEvents']
     */
    include?: string[];

    /**
     * @default []
     */
    exclude?: string[];
}

export class LayoutGroup extends React.Component<LayoutGroupProps> {}