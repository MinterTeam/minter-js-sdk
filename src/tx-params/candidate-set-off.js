import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import SetCandidateOffTxData from '../tx-data/candidate-set-off';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOffTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
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
