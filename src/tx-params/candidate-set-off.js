import {TxDataSetCandidateOff, TX_TYPE} from 'minterjs-tx';
// import TxDataSetCandidateOff from 'minterjs-tx/src/tx-data/set-candidate-off';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOffTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    const txData = new TxDataSetCandidateOff({
        pubKey: toBuffer(publicKey),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    };
}
