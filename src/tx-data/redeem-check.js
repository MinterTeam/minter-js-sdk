import secp256k1 from 'secp256k1';
import {sha256, rlphash} from 'ethereumjs-util/dist/hash';
import {privateToAddress} from 'ethereumjs-util/dist/account';
import {TxDataRedeemCheck} from 'minterjs-tx';
// import TxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check';
import {toBuffer, checkToString} from 'minterjs-util';
import {addTxDataFields} from '../utils';


/**
 * //@TODO https://github.com/MinterTeam/minter-js-sdk/issues/13 to allow easy `prepareLink` without proof
 * @param {string|Buffer} [privateKey]
 * @param {string|Buffer} check
 * @param {string|Buffer} [password]
 * @param {string|Buffer} [proof]
 * @constructor
 */
export default function RedeemCheckTxData({privateKey, check, password, proof}) {
    // Buffer or UintArray to string
    if (typeof password !== 'string') {
        password = toBuffer(password).toString('utf8');
    }
    this.check = checkToString(check);

    if (typeof privateKey === 'string' && privateKey.length) {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    if (proof) {
        proof = toBuffer(proof);
    } else if (privateKey) {
        proof = getProofWithRecovery(privateKey, password);
    }

    this.txData = new TxDataRedeemCheck({
        rawCheck: toBuffer(check),
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
    const txData = new TxDataRedeemCheck(data);
    txData.check = txData.rawCheck;
    return RedeemCheckTxData.fromBufferFields(txData);
};

/**
 * @param {Buffer} privateKey
 * @param {string} password
 * @return {ArrayBuffer|Buffer}
 */
function getProofWithRecovery(privateKey, password) {
    const addressBuffer = privateToAddress(privateKey);
    const addressHash = rlphash([
        addressBuffer,
    ]);

    if (typeof password === 'string') {
        password = Buffer.from(password, 'utf-8');
    }

    const passphraseBuffer = sha256(password);
    const proof = secp256k1.sign(addressHash, passphraseBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;

    return proofWithRecovery;
}
