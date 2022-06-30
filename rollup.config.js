import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    external: ['react'],
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'Lively',
        globals: {
            react: 'React'
        }
    },
    plugins: [
        resolve(),
        babel({
            babelHelpers: 'bundled'
        }),
        terser()
    ]
}