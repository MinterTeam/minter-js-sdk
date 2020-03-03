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
 * @param {ByteArray} buf
 * @return {string}
 */
export function bufferToInteger(buf) {
    buf = bufferFromBytes(buf);

    return (new BN(buf, 16)).toString(10);
}

/**
 * @param {ByteArray} bytes
 * @return {Buffer}
 */
export function bufferFromBytes(bytes) {
    if (bytes.length === undefined) {
        throw new Error('Invalid value passed as ByteArray, it should be Buffer, Uint8Array or hex string');
    }
    // string to Buffer
    if (typeof bytes === 'string') {
        bytes = bytes.replace('0x', '');
        return Buffer.from(bytes, 'hex');
    }
    // Uint8Array to Buffer
    if (!Buffer.isBuffer(bytes)) {
        return Buffer.from(bytes);
    }

    // it is Buffer already
    return bytes;
}

/**
 * @deprecated
 * @borrows integerToHexString
 */
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
