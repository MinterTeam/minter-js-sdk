import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import rename from 'rollup-plugin-rename';


export default {
    input: 'src/index.js',
    plugins: [
        // nodejs v10 doesn't support optional chaining
        babel({
            babelrc: false,
            configFile: false,
            "plugins": [
                "@babel/plugin-proposal-optional-chaining",
            ],
        }),
        commonjs({
        }),
        resolve({
            resolveOnly: ['lodash-es'],
            // modulesOnly: true,
            // preferBuiltins: false,
        }),
        babel({
            // exclude: 'node_modules/@babel/runtime/**',
            runtimeHelpers: true,
        }),
        rename({
            include: ['**/*.js'],
            map: (name) => name
                .replace('src/', '')
                .replace('node_modules/', 'external/')
                .replace('../../external', '../external'),
        })
    ],
    output: {
        dir: 'dist/cjs/',
        format: 'cjs',
        preserveModules: true,
    },
};
