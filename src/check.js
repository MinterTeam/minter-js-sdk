import {ecsign} from 'ethereumjs-util/dist/signature.js';
import {rlphash, sha256} from 'ethereumjs-util/dist/hash.js';
import {toBuffer as ethToBuffer} from 'ethereumjs-util/dist/bytes.js';
import secp256k1 from 'secp256k1';
import {defineProperties} from 'minterjs-tx';
import {convertToPip, convertFromPip, mPrefixStrip, toBuffer} from 'minterjs-util';
// import {convertToPip, convertFromPip} from 'minterjs-util/src/converter.js';
// import {mPrefixStrip} from 'minterjs-util/src/prefix.js';
import {integerToHexString, bufferToInteger, validateUint, validateAmount, getPrivateKeyFromSeedPhrase} from './utils.js';

class Check {
    constructor(data) {
        data = data || {};
        if (typeof data === 'string') {
            data = mPrefixStrip(data);
        }

        // Define Properties
        const fields = [
            {
                name: 'nonce',
                length: 16,
                allowLess: true,
            }, {
                name: 'chainId',
                length: 1,
            }, {
                name: 'dueBlock',
                length: 8,
                allowLess: true,
            }, {
                name: 'coin',
                length: 4,
                allowLess: true,
            }, {
                name: 'value',
                length: 32,
                allowLess: true,
            }, {
                name: 'gasCoin',
                length: 4,
                allowLess: true,
            }, {
                name: 'lock',
                allowZero: true,
                allowLess: true,
                length: 65,
                default: Buffer.from([]),
            }, {
                name: 'v',
                allowZero: true,
                default: Buffer.from([0x1c]),
            }, {
                name: 'r',
                length: 32,
                allowZero: true,
                allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 's',
                length: 32,
                allowZero: true,
                allowLess: true,
                default: Buffer.from([]),
            }];

        /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
        // attached serialize
        defineProperties(this, fields, data);
    }

    hash() {
        // don't hash last 4 fields (lock and signature)
        return rlphash(this.raw.slice(0, -4));
    }

    sign(privateKey, password) {
        const messageHash = this.hash(false);

        if (typeof password === 'string') {
            password = Buffer.from(password, 'utf8');
        }

        const passwordBuffer = sha256(password);
        const lock = secp256k1.ecdsaSign(messageHash, passwordBuffer);
        /** @type {Buffer} */
        const lockWithRecovery = Buffer.alloc(65);
        lockWithRecovery.set(lock.signature, 0);
        lockWithRecovery[64] = lock.recid;
        this.lock = `0x${lockWithRecovery.toString('hex')}`;

        // don't hash last 3 signature fields
        const messageHashWithLock = rlphash(this.raw.slice(0, -3));
        const sig = ecsign(messageHashWithLock, privateKey);
        Object.assign(this, sig);
    }
}

/**
 * @param {object} params
 * @param {string} [params.seedPhrase]
 * @param {string|Buffer} [params.privateKey] - hex or Buffer
 * @param {string} params.password - utf8
 * @param {string} params.nonce
 * @param {number} [params.chainId=1]
 * @param {number|string} params.coin
 * @param {number|string} params.value
 * @param {number|string} params.gasCoin
 * @param {number} [params.dueBlock=999999999]
 * @param {boolean} [isReturnObject]
 * @return {string|Check}
 */
export default function issueCheck({seedPhrase, privateKey, password, nonce, chainId = 1, coin, value, gasCoin = 0, dueBlock = 999999999} = {}, isReturnObject = false) {
    validateUint(dueBlock, 'dueBlock');
    validateUint(coin, 'coin');
    validateUint(gasCoin, 'gasCoin');
    validateAmount(value, 'value');

    if (!seedPhrase && !privateKey) {
        throw new Error('seedPhrase or privateKey are required');
    }

    if (!privateKey && seedPhrase) {
        privateKey = getPrivateKeyFromSeedPhrase(seedPhrase);
    }

    privateKey = ethToBuffer(privateKey);

    let check = new Check({
        nonce: Buffer.from(nonce.toString(), 'utf8'),
        chainId: integerToHexString(chainId),
        coin: integerToHexString(coin),
        value: `0x${convertToPip(value, 'hex')}`,
        gasCoin: integerToHexString(gasCoin),
        dueBlock: integerToHexString(dueBlock),
    });
    check.sign(privateKey, password);

    return isReturnObject ? check : `Mc${check.serialize().toString('hex')}`;
}


/**
 * @param {string} rawCheck
 */
export function decodeCheck(rawCheck) {
    const check = new Check(rawCheck);
    return {
        nonce: check.nonce.toString('utf8'),
        chainId: bufferToInteger(check.chainId),
        coin: bufferToInteger(check.coin),
        value: convertFromPip(bufferToInteger(check.value)),
        gasCoin: bufferToInteger(check.gasCoin),
        dueBlock: bufferToInteger(check.dueBlock),
    };
}

/**
 * @param {string|Buffer} rawCheck
 * @return {string}
 */
export function getGasCoinFromCheck(rawCheck) {
    try {
        const check = new Check(toBuffer(rawCheck));
        return bufferToInteger(check.gasCoin);
    } catch (error) {
        error.message = `Can't decode check: ${error.message}`;
        throw error;
    }
}
