import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: ['src/index.js', 'src/animations.js', 'src/hooks.js'],
    external: ['react', 'react-dom'],
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
    plugins: [
        resolve(),
        babel({
            babelHelpers: 'bundled'
        }),
        terser()
    ]
}