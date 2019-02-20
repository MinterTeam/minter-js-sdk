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
export function toHexString(num) {
    // handle exponential values
    num = (new Big(num)).toFixed();
    // convert to hex
    const hexNum = (new BN(num, 10)).toString(16);
    return padToEven(hexNum);
}
