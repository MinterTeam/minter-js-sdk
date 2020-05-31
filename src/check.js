import {defineProperties} from 'ethereumjs-util/dist/object.js';
import {ecsign} from 'ethereumjs-util/dist/signature.js';
import {rlphash, sha256} from 'ethereumjs-util/dist/hash.js';
import secp256k1 from 'secp256k1';
import {convertToPip, convertFromPip, mPrefixStrip, toBuffer, coinToBuffer, bufferToCoin} from 'minterjs-util';
// import {convertToPip, convertFromPip} from 'minterjs-util/src/converter.js';
// import {mPrefixStrip} from 'minterjs-util/src/prefix.js';
import {isNumericInteger, integerToHexString, bufferToInteger, toInteger} from './utils.js';

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
                length: 32,
                allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 'chainId',
                length: 1,
                allowLess: true,
                default: new Buffer([]),
            }, {
                name: 'dueBlock',
                length: 8,
                allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 'coin',
                length: 10,
                allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 'value',
                length: 32,
                allowZero: true,
                allowLess: true,
                default: Buffer.from([]),
            }, {
                name: 'gasCoin',
                length: 10,
                allowLess: false,
                default: Buffer.alloc(10),
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
        return rlphash(this.raw.slice(0, this.raw.length - 4));
    }

    sign(privateKey, password) {
        const msgHash = this.hash(false);

        if (typeof password === 'string') {
            password = Buffer.from(password, 'utf-8');
        }

        const passwordBuffer = sha256(password);
        const lock = secp256k1.sign(msgHash, passwordBuffer);
        /** @type Buffer */
        const lockWithRecovery = new (lock.signature.constructor)(65);
        lockWithRecovery.set(lock.signature, 0);
        lockWithRecovery[64] = lock.recovery;
        this.lock = `0x${lockWithRecovery.toString('hex')}`;

        // don't hash last 3 signature fields
        const msgHashWithLock = rlphash(this.raw.slice(0, this.raw.length - 3));
        const sig = ecsign(msgHashWithLock, privateKey);
        Object.assign(this, sig);
    }
}

/**
 *
 * @param {string|Buffer} privateKey - hex or Buffer
 * @param {string} password - utf8
 * @param {string} nonce
 * @param {number} [chainId=1]
 * @param {string} coin
 * @param {string} [coinSymbol]
 * @param {number|string} value
 * @param {string} gasCoin
 * @param {number} [dueBlock=999999999]
 * @param {boolean} [isReturnObject]
 * @return {string|Check}
 */
export default function issueCheck({privateKey, password, nonce, chainId = 1, coin, coinSymbol, value, gasCoin, dueBlock = 999999999} = {}, isReturnObject) {
    // @TODO accept exponential
    if (!isNumericInteger(dueBlock)) {
        throw new Error('Invalid due block. Should be a numeric integer');
    }

    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    if (!gasCoin) {
        gasCoin = toInteger(chainId) === '2' ? 'MNT' : 'BIP';
    }

    if (typeof gasCoin !== 'string' || gasCoin.length < 3) {
        throw new Error('issueCheck failed: invalid gasCoin given');
    }

    coin = coin || coinSymbol;

    let check = new Check({
        nonce: Buffer.from(nonce.toString(), 'utf-8'),
        chainId: `0x${integerToHexString(chainId)}`,
        coin: coinToBuffer(coin),
        value: `0x${convertToPip(value, 'hex')}`,
        gasCoin: coinToBuffer(gasCoin),
        dueBlock: `0x${integerToHexString(dueBlock)}`,
    });
    check.sign(privateKey, password);

    return isReturnObject ? check : `Mc${check.serialize().toString('hex')}`;
}


export function decodeCheck(rawCheck) {
    const check = new Check(rawCheck);
    return {
        nonce: check.nonce.toString('utf-8'),
        chainId: bufferToInteger(check.chainId),
        coin: bufferToCoin(check.coin),
        value: convertFromPip(bufferToInteger(check.value)),
        gasCoin: bufferToCoin(check.gasCoin),
        dueBlock: bufferToInteger(check.dueBlock),
    };
}

/**
 * @param {string|Buffer} rawCheck
 * @return {string}
 */
export function getGasCoinFromCheck(rawCheck) {
    const check = new Check(toBuffer(rawCheck));
    return bufferToCoin(check.gasCoin);
}
