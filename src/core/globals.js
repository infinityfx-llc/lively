export const POSITIONS = ['set', 'start', 'end'];

export const UNITS = ['%', 'px', 'em', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'deg', 'rad'];

export const UNITLESS = ['opacity', 'active', 'interact', 'zIndex', 'lineHeight', 'fontWeight', 'length'];

export const PARSABLE_OBJECTS = [
    ['x', 'y'], // might need z for 3d transforms
    ['r', 'g', 'b', 'a'],
    ['left', 'top', 'right', 'bottom']
];

export const TRANSFORMS = ['translate', 'scale', 'skew', 'rotate']; // this is also apply order (maybe allow custom order)

export const DEFAULTS = { // implement defaults for custom properties such as length, or active (or find a way to get current value)
    translate: { x: [0, 'px'], y: [0, 'px'] },
    scale: { x: [100, '%'], y: [100, '%'] },
    clip: { left: [0, '%'], top: [0, '%'], right: [0, '%'], bottom: [0, '%'] },
    r: [127, null],
    g: [127, null],
    b: [127, null],
    a: [255, null]
};