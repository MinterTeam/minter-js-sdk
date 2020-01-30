import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import SetCandidateOnTxData from '../tx-data/candidate-set-on.js';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOnTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    const txData = new SetCandidateOnTxData({
        publicKey,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SET_CANDIDATE_ON,
        txData: txData.serialize(),
    };
}
