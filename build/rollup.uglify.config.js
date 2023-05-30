import baseConfig from './rollup.config.js';

// uglifyjs alternative with es6 support
import terser from '@rollup/plugin-terser';

const config = Object.assign({}, baseConfig);
// const config = Object.assign({}, baseConfig, {output: Object.assign({}, baseConfig.output)});


if (config.plugins.at(-1).name === 'visualizer') {
    // put just before 'visualizer'
    config.plugins.splice(-1, 0, terser());
} else {
    config.plugins.push(terser());
}

config.output = Array.isArray(config.output) ? config.output : [config.output];
config.output = config.output.map((item) => {
    return {
        ...item,
        file: item.file.replace(/\.js$/, '.min.js')
    };
});

export default config;
