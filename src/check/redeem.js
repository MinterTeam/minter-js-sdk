import RedeemCheckTxData from 'minterjs-tx/src/tx-data/redeem-check';
import {TX_TYPE_REDEEM_CHECK} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
import {Buffer} from 'safe-buffer';
import {sendTx, getProofWithRecovery} from '../utils/index';

/**
 * @param {string} nodeUrl
 * @param {string|Buffer} privateKey
 * @param {string} check
 * @param {string} password
 * @param {string} [feeCoinSymbol] - should be base coin
 * @return {Promise}
 */
export default function redeemCheck({nodeUrl, privateKey, check, password, feeCoinSymbol}) {
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

    return sendTx({
        nodeUrl,
        privateKey,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_REDEEM_CHECK,
        txData: txData.serialize(),
    });
}
