import ethUtil from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
import {Buffer} from 'safe-buffer';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util/src/converter';

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
        ethUtil.defineProperties(this, fields, data);
    }

    hash() {
        return ethUtil.rlphash(this.raw.slice(0, 4));
    }

    sign(privateKey, passphrase) {
        const msgHash = this.hash(false);

        const passphraseBuffer = ethUtil.sha256(passphrase);
        const lock = secp256k1.sign(msgHash, passphraseBuffer);
        const lockWithRecovery = new (lock.signature.constructor)(65);
        lockWithRecovery.set(lock.signature, 0);
        lockWithRecovery[64] = lock.recovery;
        this.lock = `0x${lockWithRecovery.toString('hex')}`;

        const msgHashWithLock = ethUtil.rlphash(this.raw.slice(0, 5));
        const sig = ethUtil.ecsign(msgHashWithLock, privateKey);
        Object.assign(this, sig);
    }
}

/**
 *
 * @param {string|Buffer} privateKey - hex or Buffer
 * @param {string} passPhrase - utf8
 * @param {number} nonce
 * @param {string} coinSymbol
 * @param {number} value
 * @param {number} dueBlock
 * @return {string}
 */
export default function issueCheck({privateKey, passPhrase, nonce, coinSymbol, value, dueBlock = 999999999}) {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    const check = new Check({
        nonce: `0x${nonce.toString(16)}`,
        coin: formatCoin(coinSymbol),
        value: `0x${convertToPip(value, 'hex')}`,
        dueBlock: `0x${Number(dueBlock).toString(16)}`,
    });
    check.sign(privateKey, passPhrase);
    return `Mc${check.serialize().toString('hex')}`;
}
