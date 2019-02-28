import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
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
            }
        }),
        // globals(),
        // builtins(),
        babel({
            runtimeHelpers: true
        }),
        terser(), // uglifyjs alternative with es6 support
    ],
    output: {
        file: 'dist/index.min.js',
        format: 'umd',
        name: 'minterJsTx',
    }
};
