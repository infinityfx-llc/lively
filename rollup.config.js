import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

const plugins = [
    resolve(),
    babel({
        babelHelpers: 'runtime'
    })
];

if (process.env.NODE_ENV === 'production') plugins.push(
    terser(),
    del({
        targets: 'dist/*'
    })
);

export default {
    input: ['src/index.js', 'src/animations.js', 'src/hooks.js', 'src/animate.js'],
    external: ['react', 'react-dom', /@babel\/runtime/],
    output: [
        {
            dir: 'dist/esm',
            format: 'es'
        },
        {
            dir: 'dist/cjs',
            format: 'cjs'
        }
    ],
    plugins
}