// jest.env.js
const JSDOMEnvironment = require("jest-environment-jsdom");
class CustomJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config) {
        super({
            ...config,
            globals: {
                ...config.globals,
                Uint32Array,
                Uint8Array,
                ArrayBuffer,
            },
        });
    }
}
module.exports = CustomJSDOMEnvironment;
