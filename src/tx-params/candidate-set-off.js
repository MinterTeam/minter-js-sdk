import MinterSetCandidateOffTxData from 'minterjs-tx/src/tx-data/set-candidate-off';
import {toBuffer} from 'minterjs-util';
import {TX_TYPE_SET_CANDIDATE_OFF} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {string} [message]
 * @return {TxParams}
 */
export default function SetCandidateOffTxParams({privateKey, publicKey, feeCoinSymbol, message}) {
    const txData = new MinterSetCandidateOffTxData({
        pubKey: toBuffer(publicKey),
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    };
}
