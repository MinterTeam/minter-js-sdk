import Big from 'big.js';
import BN from 'bn.js';
import {padToEven} from 'ethjs-util';

/**
 * @param {number|string} num
 * @return {boolean}
 */
export function isNumericInteger(num) {
    try {
        // `new Big()` checks for valid numeric
        return (new Big(num)).round().toFixed() === (new Big(num)).toFixed();
    } catch (e) {
        return false;
    }
}

/**
 * @param {number|string} num
 * @return {string}
 */
export function integerToHexString(num) {
    // handle exponential values
    num = (new Big(num)).toFixed();
    // convert to hex
    const hexNum = (new BN(num, 10)).toString(16);
    return padToEven(hexNum);
}

/**
 * @param {Buffer|Uint8Array|string} buf
 * @return {string}
 */
export function bufferToInteger(buf) {
    let str;
    if (typeof buf === 'string') {
        str = buf.replace('0x', '');
    } else if (buf.length !== undefined) {
        if (!Buffer.isBuffer(buf)) {
            // Uint8Array to Buffer
            buf = Buffer.from(buf);
        }
        str = buf.toString('hex');
    } else {
        throw new Error('Invalid value passed, it should be Buffer, Uint8Array or hex string');
    }

    return (new BN(str, 16)).toString(10);
}

export const toHexString = integerToHexString;

export function addTxDataFields(txData) {
    Object.defineProperty(txData, 'fields', {
        get() {
            const fields = {};
            txData.txData._fields.forEach((key) => {
                if (Array.isArray(txData[key])) {
                    // cast multisend items to fields
                    fields[key] = txData[key].map((item) => item.fields || item);
                } else {
                    fields[key] = txData[key];
                }
            });
            return fields;
        },
        enumerable: true,
    });
}
