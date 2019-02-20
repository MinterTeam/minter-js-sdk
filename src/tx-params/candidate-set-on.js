import MinterSetCandidateOnTxData from 'minterjs-tx/src/tx-data/set-candidate-on';
import {toBuffer} from 'minterjs-util/src/prefix';
import {TX_TYPE_SET_CANDIDATE_ON} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOnTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterSetCandidateOnTxData({
        pubKey: toBuffer(publicKey),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_ON,
        txData: txData.serialize(),
    };
}
