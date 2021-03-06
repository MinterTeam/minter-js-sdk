/* eslint-disable unicorn/prevent-abbreviations */

import Big from 'big.js';
import BN from 'bn.js';
import {padToEven, isHexPrefixed} from 'ethjs-util';
import {isValidAddress, isValidPublicKeyString, isValidCheck, numberToBig, COIN_MAX_MAX_SUPPLY, COIN_MIN_MAX_SUPPLY} from 'minterjs-util';
import {walletFromMnemonic, walletFromMnemonicAsync} from 'minterjs-wallet';

Big.RM = 2;

/**
 * @param {number|string} chainId
 * @param {string} coinSymbol
 * @return {boolean}
 */
export function isBaseCoinSymbol(chainId, coinSymbol) {
    if (typeof chainId === 'string' || typeof chainId === 'number') {
        chainId = integerToHexString(chainId);
    }
    if (chainId === '0x01' && coinSymbol === 'BIP') {
        return true;
    }
    if (chainId === '0x02' && coinSymbol === 'MNT') {
        return true;
    }
    return false;
}

/**
 * @param {number|string} coinIdOrSymbol
 * @return {boolean}
 */
export function isCoinId(coinIdOrSymbol) {
    if (typeof coinIdOrSymbol === 'number') {
        return true;
    }
    if (typeof coinIdOrSymbol !== 'string') {
        return false;
    }
    return /^[0-9]+$/.test(coinIdOrSymbol);
}

/**
 * @param {string} coin
 * @return {boolean}
 */
export function isCoinSymbol(coin) {
    if (isCoinId(coin)) {
        return false;
    }
    if (typeof coin !== 'string') {
        return false;
    }

    if (/^LP-[0-9]+$/.test(coin)) {
        return true;
    }

    const [ticker, versionId] = coin.split('-');

    try {
        validateTicker(ticker);
    } catch (error) {
        return false;
    }

    // check version is number
    if (versionId && !isCoinId(versionId)) {
        return false;
    }

    return true;
}

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

export function isValidNumber(value) {
    const invalid = (typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && value.length === 0);
    return !invalid;
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
 * @param {ByteArray} buf
 * @return {boolean|null}
 */
export function bufferToBoolean(buf) {
    buf = bufferFromBytes(buf);

    if (buf.toString('hex') === '01') {
        return true;
    }

    if (buf.toString('hex') === '') {
        return false;
    }

    // eslint-disable-next-line unicorn/no-null
    return null;
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

        if (valueBig && valueBig.lt(0)) {
            throw new Error(`Field \`${fieldName}\` has negative amount`);
        }
    }
}

/**
 * @param {number|string} maxSupply
 * @param {number|string} initialAmount
 */
export function validateMaxSupply(maxSupply, initialAmount) {
    validateAmount(maxSupply, 'maxSupply');
    if (maxSupply > COIN_MAX_MAX_SUPPLY || maxSupply < COIN_MIN_MAX_SUPPLY) {
        throw new Error(`Field \`maxSupply\` should be between ${COIN_MIN_MAX_SUPPLY} and ${COIN_MAX_MAX_SUPPLY}`);
    }
    if (Number(initialAmount) > Number(maxSupply)) {
        throw new Error('Field `initialAmount` should be less or equal of `maxSupply`');
    }
}

export function validateUint(origValue, fieldName) {
    validateNotEmpty(origValue, fieldName);

    const value = Number(origValue);
    if (Number.isNaN(value)) {
        throw new TypeError(`Field \`${fieldName}\` is not a number. Received: ${origValue}`);
    }

    if (value < 0) {
        throw new Error(`Field \`${fieldName}\` should be positive integer. Received: ${value}`);
    }

    if (Math.round(value) !== value) {
        throw new Error(`Field \`${fieldName}\` should be integer, decimal given`);
    }
}

export function validateUintArray(origValue, fieldName) {
    if (!Array.isArray(origValue)) {
        throw new TypeError(`Field \`${fieldName}\` is not an array`);
    }
    origValue.forEach((coin, index) => {
        try {
            validateUint(coin, fieldName);
        } catch (error) {
            // update error message
            throw new Error(error.message.replace(`\`${fieldName}\``, `\`${fieldName}\` contain invalid item at index: ${index}, it `));
        }
    });
}

export function validateTicker(value, fieldName) {
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

export function validateBoolean(value, fieldName) {
    if (typeof value !== 'boolean') {
        throw new TypeError(`Field \`${fieldName}\` should be boolean, ${typeof value} given`);
    }
}

/**
 * @param {string} seedPhrase
 * @return {string}
 */
export function getPrivateKeyFromSeedPhrase(seedPhrase) {
    return walletFromMnemonic(seedPhrase).getPrivateKeyString();
}

/**
 * @param {string} seedPhrase
 * @return {Promise<string>}
 */
export function getPrivateKeyFromSeedPhraseAsync(seedPhrase) {
    return walletFromMnemonicAsync(seedPhrase)
        .then((wallet) => {
            return wallet.getPrivateKeyString();
        });
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
