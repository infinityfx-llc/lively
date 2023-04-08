import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';

const plugins = [
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
];

if (process.env.NODE_ENV === 'production') plugins.push(
    terser(),
    del({
        targets: 'dist/*'
    })
);

export default {
    input: ['src/index.ts', 'src/animations.ts', 'src/hooks.ts'],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true
    },
    plugins
}