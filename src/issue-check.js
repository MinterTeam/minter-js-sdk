import {defineProperties, ecsign, rlphash, sha256} from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
import {Buffer} from 'safe-buffer';
import {formatCoin} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {isNumericInteger, toHexString} from './utils';

class Check {
    constructor(data) {
        data = data || {};
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

    sign(privateKey, passphrase) {
        const msgHash = this.hash(false);

        const passphraseBuffer = sha256(passphrase);
        const lock = secp256k1.sign(msgHash, passphraseBuffer);
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
 * @param {string} passPhrase - utf8
 * @param {string} nonce
 * @param {number} [chainId=1]
 * @param {string} coinSymbol
 * @param {number} value
 * @param {number} [dueBlock=999999999]
 * @return {string}
 */
export default function issueCheck({privateKey, passPhrase, nonce, chainId = 1, coinSymbol, value, dueBlock = 999999999} = {}) {
    // @TODO accept exponential
    if (!isNumericInteger(dueBlock)) {
        throw new Error('Invalid due block. Should be a numeric integer');
    }

    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    const check = new Check({
        nonce: Buffer.from(nonce.toString(), 'utf-8'),
        chainId: `0x${toHexString(chainId)}`,
        coin: formatCoin(coinSymbol),
        value: `0x${convertToPip(value, 'hex')}`,
        dueBlock: `0x${toHexString(dueBlock)}`,
    });
    check.sign(privateKey, passPhrase);
    return `Mc${check.serialize().toString('hex')}`;
}
