import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';
import babel from '@rollup/plugin-babel';
import {visualizer} from 'rollup-plugin-visualizer'

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'minterSDK',
            exports: 'auto',
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            // name: 'minterSDK',
            // exports: 'auto',
        }
    ],
    plugins: [
        // old acorn in rollup-plugin-node-globals doesn't support new syntax
        /*
        babel({
            babelrc: false,
            configFile: false,
            "plugins": [
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-numeric-separator",
            ],
        }),
        */
        commonjs({
            // required to include bip39 wordlists
            ignoreTryCatch: false,
            // namedExports: {
            //     'node_modules/ethereumjs-util/dist/index.js': [ 'stripHexPrefix', 'padToEven' ],
            // },
        }),
        json(),
        // globals(),
        // builtins({
        //     // crypto: true,
        // }),
        nodePolyfills(),
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        babel({
            exclude: 'node_modules/@babel/runtime/**',
            babelHelpers: 'runtime',
        }),
        visualizer({
            filename: 'tmp/stats.html',
        }),
    ],
    strictDeprecations: true,
};
