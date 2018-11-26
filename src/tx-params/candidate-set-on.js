import MinterSetCandidateOnTxData from 'minterjs-tx/src/tx-data/set-candidate-on';
import {toBuffer} from 'minterjs-util';
import {TX_TYPE_SET_CANDIDATE_ON} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {string} [message]
 * @return {TxParams}
 */
export default function SetCandidateOnTxParams({privateKey, publicKey, feeCoinSymbol, message}) {
    const txData = new MinterSetCandidateOnTxData({
        pubKey: toBuffer(publicKey),
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_ON,
        txData: txData.serialize(),
    };
}
