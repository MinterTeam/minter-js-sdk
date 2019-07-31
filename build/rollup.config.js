import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [
        json(),
        resolve({
            browser: true,
        }),
        commonjs({
            namedExports: {
                'node_modules/ethereumjs-util/dist/index.js': [ 'stripHexPrefix', 'padToEven' ],
            },
        }),
        globals(),
        builtins({
            crypto: true,
        }),
        babel({
            exclude: 'node_modules/@babel/runtime/**',
            runtimeHelpers: true,
        }),
    ],
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'minterSDK',
    },
};
