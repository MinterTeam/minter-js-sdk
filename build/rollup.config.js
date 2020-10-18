import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'minterSDK',
    },
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
            // namedExports: {
            //     'node_modules/ethereumjs-util/dist/index.js': [ 'stripHexPrefix', 'padToEven' ],
            // },
        }),
        json(),
        globals(),
        builtins({
            // crypto: true,
        }),
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        babel({
            exclude: 'node_modules/@babel/runtime/**',
            babelHelpers: 'runtime',
        }),
    ],
};
