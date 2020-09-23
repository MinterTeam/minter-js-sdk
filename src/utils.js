/* eslint-disable unicorn/prevent-abbreviations */

import Big from 'big.js';
import BN from 'bn.js';
import {padToEven, isHexPrefixed} from 'ethjs-util';
import {isValidAddress, isValidPublicKeyString, isValidCheck, numberToBig, COIN_MAX_AMOUNT} from 'minterjs-util';

/**
 * @param {number|string} num
 * @return {boolean}
 */
export function isNumericInteger(num) {
    try {
        // `new Big()` checks for valid numeric
        return (new Big(num)).round().toFixed() === (new Big(num)).toFixed();
    } catch (error) {
        return false;
    }
}

/**
 * @param {number|string|ByteArray} num
 * @return {string}
 */
export function integerToHexString(num) {
    num = toInteger(num);
    // handle exponential values
    num = (new Big(num)).toFixed();
    // convert to hex
    const hexNum = (new BN(num, 10)).toString(16);
    return `0x${padToEven(hexNum)}`;
}

/**
 * @param {number|string|ByteArray} num
 * @return {string}
 */
export function toInteger(num) {
    if (typeof num === 'number') {
        return num.toString();
    }
    if (typeof num !== 'undefined' && num !== null && num.length > 0) {
        // handle hex prefixed string
        if (typeof num === 'string' && isHexPrefixed(num)) {
            return bufferToInteger(num);
        }
        // handle arrays
        if (typeof num !== 'string') {
            return bufferToInteger(num);
        }
    }

    num = Number.parseInt(num, 10);

    return Number.isNaN(num) ? '' : num.toString();
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

export function proxyNestedTxData(obj) {
    addTxDataFields(obj);

    // proxy TxData
    obj.raw = obj.txData.raw;
    obj.serialize = obj.txData.serialize;
    obj.serializeToString = obj.txData.serializeToString;
}

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

export function validateAddress(value, fieldName) {
    validateNotEmpty(value, fieldName);

    if (typeof value === 'string' && !isValidAddress(value)) {
        throw new Error(`Field \`${fieldName}\` is invalid address`);
    }
}

export function validatePublicKey(value, fieldName) {
    validateNotEmpty(value, fieldName);

    if (typeof value === 'string' && !isValidPublicKeyString(value)) {
        throw new Error(`Field \`${fieldName}\` is invalid public key`);
    }
}

export function validateCheck(value, fieldName) {
    validateNotEmpty(value, fieldName);

    if (typeof value === 'string' && !isValidCheck(value)) {
        throw new Error(`Field \`${fieldName}\` is invalid check string`);
    }
}

export function validateAmount(value, fieldName) {
    validateNotEmpty(value, fieldName);

    if (typeof value === 'string' || typeof value === 'number') {
        let valueBig;
        try {
            valueBig = numberToBig(value);
        } catch (error) {
            throw new Error(`Field \`${fieldName}\` is invalid number`);
        }

        if (valueBig && valueBig.gt(COIN_MAX_AMOUNT)) {
            throw new Error(`Field \`${fieldName}\` has value which is greater than network's max amount: 10^15`);
        }
        if (valueBig && valueBig.lt(0)) {
            throw new Error(`Field \`${fieldName}\` has negative amount`);
        }
    }
}

export function validateUint(value, fieldName) {
    validateNotEmpty(value, fieldName);

    value = Number(value);
    if (Number.isNaN(value)) {
        throw new TypeError(`Field \`${fieldName}\` is not a number`);
    }

    if (value < 0) {
        throw new Error(`Field \`${fieldName}\` should be positive integer`);
    }

    if (Math.round(value) !== value) {
        throw new Error(`Field \`${fieldName}\` should be integer, decimal given`);
    }
}

export function validateCoin(value, fieldName) {
    validateNotEmpty(value, fieldName);

    if (typeof value === 'string' && !(/^[A-Z0-9]{3,10}$/.test(value))) {
        throw new Error(`Field \`${fieldName}\` is invalid coin symbol string`);
    }
}

function validateNotEmpty(value, fieldName) {
    if (typeof value === 'undefined') {
        throw new TypeError(`Field \`${fieldName}\` is undefined`);
    }
    if (value === null) {
        throw new Error(`Field \`${fieldName}\` is null`);
    }
    if (value === false) {
        throw new Error(`Field \`${fieldName}\` is false`);
    }
    if (value === '') {
        throw new Error(`Field \`${fieldName}\` is empty string`);
    }
}

/**
 * Promisify setTimeout
 * @param {number} time - milliseconds
 * @return {Promise}
 */
export function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
