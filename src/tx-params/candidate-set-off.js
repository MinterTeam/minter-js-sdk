import MinterSetCandidateOffTxData from 'minterjs-tx/src/tx-data/set-candidate-off';
import {toBuffer} from 'minterjs-util';
import {TX_TYPE_SET_CANDIDATE_OFF} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOffTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterSetCandidateOffTxData({
        pubKey: toBuffer(publicKey),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    };
}
