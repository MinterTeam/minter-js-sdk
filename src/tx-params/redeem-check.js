import secp256k1 from 'secp256k1';
import {sha256, rlphash} from 'ethereumjs-util/dist/hash';
import {privateToAddress} from 'ethereumjs-util/dist/account';
import {TxDataRedeemCheck, TX_TYPE} from 'minterjs-tx';
// import TxDataRedeemCheck from 'minterjs-tx/src/tx-data/redeem-check';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {getGasCoinFromCheck} from '../check';


/**
 * @constructor
 * @param {string|Buffer} privateKey
 * @param {string} check
 * @param {string} [password]
 * @param {string|Buffer} [proof]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function RedeemCheckTxParams({privateKey, check, password, proof, ...otherParams}) {
    const gasCoin = getGasCoinFromCheck(check);
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    const proofWithRecovery = proof || getProofWithRecovery(privateKey, password);
    const txData = new TxDataRedeemCheck({
        rawCheck: toBuffer(check),
        proof: proofWithRecovery,
    });

    return {
        ...otherParams,
        privateKey,
        // only gasPrice: 1 is allowed by blockchain
        gasPrice: 1,
        gasCoin,
        txType: TX_TYPE.REDEEM_CHECK,
        txData: txData.serialize(),
    };
}

/**
 * @param {Buffer} privateKey
 * @param {string} password
 * @return {ArrayBuffer}
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
