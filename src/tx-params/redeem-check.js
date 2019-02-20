import {Buffer} from 'safe-buffer';
import secp256k1 from 'secp256k1';
import {sha256, rlphash, privateToAddress} from 'ethereumjs-util';
import RedeemCheckTxData from 'minterjs-tx/src/tx-data/redeem-check';
import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util/src/prefix';


/**
 * @constructor
 * @param {string|Buffer} privateKey
 * @param {string} check
 * @param {string} password
 * @param {string} [feeCoinSymbol] - should be base coin
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function RedeemCheckTxParams({privateKey, check, password, feeCoinSymbol, ...otherParams}) {
    if (feeCoinSymbol && (feeCoinSymbol.toUpperCase() !== 'MNT' && feeCoinSymbol.toUpperCase() !== 'BIP')) {
        throw new Error('feeCoinSymbol should be baseCoin');
    }
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    const proofWithRecovery = getProofWithRecovery(privateKey, password);
    const txData = new RedeemCheckTxData({
        rawCheck: toBuffer(check),
        proof: `0x${proofWithRecovery.toString('hex')}`,
    });

    return {
        ...otherParams,
        privateKey,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_REDEEM_CHECK,
        txData: txData.serialize(),
    };
}

/**
 * @param {Buffer} privateKey
 * @param {string} password
 * @return {ArrayBuffer}
 */
export function getProofWithRecovery(privateKey, password) {
    const addressBuffer = privateToAddress(privateKey);
    const addressHash = rlphash([
        addressBuffer,
    ]);

    const passphraseBuffer = sha256(password);
    const proof = secp256k1.sign(addressHash, passphraseBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;

    return proofWithRecovery;
}
