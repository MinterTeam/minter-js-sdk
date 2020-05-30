import secp256k1 from 'secp256k1';
import {sha256, rlphash} from 'ethereumjs-util/dist/hash.js';
import {privateToAddress} from 'ethereumjs-util/dist/account.js';
import {isHexPrefixed, isHexString} from 'ethjs-util';
import {TxDataRedeemCheck} from 'minterjs-tx';
// import TxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check.js';
import {toBuffer, checkToString} from 'minterjs-util';
import {addTxDataFields, validateCheck} from '../utils.js';


/**
 * @param {ByteArray} check
 * @param {ByteArray} [proof]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function RedeemCheckTxData({check, proof}, options = {}) {
    validateCheck(check, 'check');

    // eslint-disable-next-line prefer-rest-params
    if (!options.password && arguments[0].password) {
        // eslint-disable-next-line prefer-rest-params
        options.password = arguments[0].password;
        // eslint-disable-next-line no-console
        console.warn('Check password in tx data is deprecated. Pass it as field in the second argument.');
    }
    // eslint-disable-next-line prefer-rest-params
    if (!options.privateKey && arguments[0].privateKey) {
        // eslint-disable-next-line prefer-rest-params
        options.privateKey = arguments[0].privateKey;
        // eslint-disable-next-line no-console
        console.warn('Private key in tx data is deprecated. Pass it as field in the second argument.');
    }
    this.check = checkToString(check);

    if (proof) {
        proof = toBuffer(proof);
    } else if (options.address || options.privateKey) {
        proof = getProofWithRecovery(options);
    }

    this.txData = new TxDataRedeemCheck({
        check: toBuffer(check),
        proof,
    });
    this.proof = proof ? `0x${proof.toString('hex')}` : undefined;

    addTxDataFields(this);

    // proxy TxDataRedeemCheck
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 *
 * @param {Buffer|string} check
 * @param {Buffer|string} proof
 * @return {RedeemCheckTxData}
 */
RedeemCheckTxData.fromBufferFields = function fromBufferFields({check, proof}) {
    return new RedeemCheckTxData({
        check,
        proof,
    });
};

/**
 * @param {Buffer|string} data
 * @return {RedeemCheckTxData}
 */
RedeemCheckTxData.fromRlp = function fromRlp(data) {
    return RedeemCheckTxData.fromBufferFields(new TxDataRedeemCheck(data));
};

/**
 * @param {ByteArray} password
 * @param {ByteArray} [address]
 * @param {ByteArray} [privateKey]
 * @return {ArrayBuffer|Buffer}
 */
function getProofWithRecovery({password, address, privateKey}) {
    let addressBuffer;
    if (address) {
        addressBuffer = toBuffer(address);
    } else if (privateKey) {
        if (typeof privateKey === 'string' && privateKey.length && !isHexPrefixed(privateKey) && isHexString(`0x${privateKey}`)) {
            privateKey = `0x${privateKey}`;
            // eslint-disable-next-line no-console
            console.warn('Usage of privateKey string without 0x prefix is deprecated');
        }
        privateKey = toBuffer(privateKey);
        addressBuffer = privateToAddress(privateKey);
    } else {
        throw new Error('No address or private key given to generate proof');
    }
    const addressHash = rlphash([
        addressBuffer,
    ]);

    // ensure Buffer
    if (typeof password === 'string') {
        password = Buffer.from(password, 'utf-8');
    } else {
        password = toBuffer(password);
    }

    const passwordBuffer = sha256(password);
    const proof = secp256k1.sign(addressHash, passwordBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;

    return proofWithRecovery;
}
