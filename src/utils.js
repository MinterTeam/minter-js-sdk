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
 * @TODO accepts 0x prefixed hex strings?
 * @param {Buffer} buf
 */
export function bufferToInteger(buf) {
    return parseInt(buf.toString('hex'), 16) || 0;
}

export const toHexString = integerToHexString;

export function addTxDataFields(txData) {
    Object.defineProperty(txData, 'fields', {
        get() {
            const fields = {};
            txData.txData._fields.forEach((key) => {
                fields[key] = txData[key];
            });
            return fields;
        },
        enumerable: true,
    });
}
