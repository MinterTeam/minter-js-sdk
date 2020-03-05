import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import SetCandidateOffTxData from '../tx-data/candidate-set-off.js';

/**
 * @deprecated
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOffTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('SetCandidateOffTxParams is deprecated');

    const txData = new SetCandidateOffTxData({
        publicKey,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    };
}
