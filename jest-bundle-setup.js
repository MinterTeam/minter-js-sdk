import {isBuffer} from 'buffer-es6';
import {Buffer as safeBuffer} from 'safe-buffer';




const originalExpect = global.expect;

global.expect = (value) => {
    value = walkFix(value);
    const expectResult = originalExpect(value);

    // fix toEqual
    const originalToEqual = expectResult.toEqual;
    expectResult.toEqual = (value) => {
        value = walkFix(value);
        return originalToEqual(value);
    };
    expectResult.toEqual.__proto__ = originalToEqual;
    return expectResult;
};
global.expect.__proto__ = originalExpect;


const WALK_DEPTH = 10;
/**
 * walk through keys and fix each
 * @param obj
 * @param {number} [currentDepth]
 */
function walkFix(obj, currentDepth = 0) {
    // fix it if it's a Buffer
    obj = fixBuffer(obj);
    if (!obj || currentDepth > WALK_DEPTH) {
        return obj;
    }
    // try fix each key if it's an Object
    Object.keys(obj).forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor.writable) {
            obj[key] = walkFix(obj[key], currentDepth + 1);
        }
    });
    return obj;
}

/**
 * Convert Buffer implementation of bundled `buffer-es6` to `safe-buffer` implementation used in tests and `safe-buffer` used in rollup's browserify
 * It requires to satisfy jest's `.toEqual()` deep equality check
 * @param value
 * @return {Buffer}
 */
function fixBuffer(value) {
    if (isBuffer(value)) {
        value = safeBuffer.from(value);
    }
    return value;
}
