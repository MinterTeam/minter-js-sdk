import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import SetCandidateOnTxData from '../tx-data/candidate-set-on.js';

/**
 * @deprecated
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOnTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('SetCandidateOnTxParams is deprecated');

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
