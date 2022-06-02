// jest.env.js
const JSDOMEnvironment = require("jest-environment-jsdom").default;
class CustomJSDOMEnvironment extends JSDOMEnvironment {
    /*
    // doesn't work in jest 28
    constructor(config, context) {
        super({
            ...config,
            globals: {
                ...config.globals,
                Uint32Array,
                Uint8Array,
                ArrayBuffer,
            },
        }, context);
    }
    */
    async setup() {
        await super.setup();
        this.global.Uint8Array = Uint8Array;
        this.global.ArrayBuffer = ArrayBuffer;
    }
}
module.exports = CustomJSDOMEnvironment;
