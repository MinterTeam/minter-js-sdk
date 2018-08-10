import RedeemCheckTxData from 'minterjs-tx/src/tx-data/redeem-check';
import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
import {Buffer} from 'safe-buffer';
import secp256k1 from 'secp256k1';
import ethUtil from 'ethereumjs-util';

/**
 * @param {string} nodeUrl
 * @param {string|Buffer} privateKey
 * @param {string} check
 * @param {string} password
 * @param {string} [feeCoinSymbol] - should be base coin
 * @return {TxParams}
 */
export default function redeemCheckTx({nodeUrl, privateKey, check, password, feeCoinSymbol}) {
    if (feeCoinSymbol && (feeCoinSymbol.toUpperCase() !== 'MNT' && feeCoinSymbol.toUpperCase() !== 'BIP')) {
        throw new Error('feeCoinSymbol for redeemCheck() should be baseCoin');
    }
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    const proofWithRecovery = getProofWithRecovery(privateKey, password);
    const txData = new RedeemCheckTxData({
        check: toBuffer(check),
        proof: `0x${proofWithRecovery.toString('hex')}`,
    });

    return {
        nodeUrl,
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
    const addressBuffer = ethUtil.privateToAddress(privateKey);
    const addressHash = ethUtil.rlphash([
        addressBuffer,
    ]);

    const passphraseBuffer = ethUtil.sha256(password);
    const proof = secp256k1.sign(addressHash, passphraseBuffer);
    const proofWithRecovery = new (proof.signature.constructor)(65);
    proofWithRecovery.set(proof.signature, 0);
    proofWithRecovery[64] = proof.recovery;

    return proofWithRecovery;
}
