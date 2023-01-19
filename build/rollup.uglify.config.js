import baseConfig from './rollup.config';

// uglifyjs alternative with es6 support
import { terser } from 'rollup-plugin-terser';


const config = Object.assign({}, baseConfig, {output: Object.assign({}, baseConfig.output)});


if (config.plugins.at(-1).name === 'visualizer') {
    // put just before 'visualizer'
    config.plugins.splice(-1, 0, terser());
} else {
    config.plugins.push(terser());
}
config.output.file = config.output.file.replace(/\.js$/, '.min.js');

export default config;
