export const POSITIONS = ['set', 'start', 'end'];

export const UNITS = ['%', 'px', 'em', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'deg', 'rad'];

export const DEFAULT_UNITS = {
    rotate: 'deg',
    skew: 'deg',
    scale: '%',
    clip: '%',
    opacity: null,
    zIndex: null,
    lineHeight: null,
    fontWeight: null,
    length: null,
    default: 'px'
};

export const PARSABLE_OBJECTS = [
    ['x', 'y'], // might need z for 3d transforms
    ['r', 'g', 'b', 'a'],
    ['left', 'top', 'right', 'bottom']
];

export const DEFAULT_OBJECTS = { // implement defaults for custom properties such as length, or active (or find a way to get current value)
    translate: { x: [0, 'px'], y: [0, 'px'] },
    scale: { x: [1, '%'], y: [1, '%'] },
    clip: { left: [0, '%'], top: [0, '%'], right: [0, '%'], bottom: [0, '%'] },
    r: [127, null],
    g: [127, null],
    b: [127, null],
    a: [255, null]
};

export const TRANSFORMS = ['translate', 'scale', 'skew', 'rotate']; // (maybe allow custom order)

export const MORPH_PROPERTIES = ['translate', 'scale', 'rotate', 'opacity', 'borderRadius', 'backgroundColor', 'color', 'zIndex', 'pointerEvents'];

export const MERGE_FUNCTIONS = { // OPTIMIZE
    translate: (a, b) => a + b,
    rotate: (a, b) => a + b,
    scale: (a, b) => a * b,
    default: (a, b) => (a + b) / 2
};