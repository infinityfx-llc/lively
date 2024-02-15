import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import preserveDirectives from 'rollup-plugin-preserve-directives';

const plugins = [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    preserveDirectives()
];

if (process.env.NODE_ENV === 'production') {
    plugins.splice(3, 0, terser({ compress: { directives: false } }));
    plugins.unshift(del({
        targets: 'dist/**'
    }));
}

export default {
    input: ['src/index.ts', 'src/animations.ts', 'src/hooks.ts', 'src/layout.ts'],
    external: ['react', 'react-dom', 'react/jsx-runtime', 'tslib'],
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins,
    onwarn: (msg, handler) => {
        if (msg.code === 'MODULE_LEVEL_DIRECTIVE') return;

        handler(msg);
    }
}