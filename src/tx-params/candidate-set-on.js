import {TxDataSetCandidateOn, TX_TYPE} from 'minterjs-tx';
// import TxDataSetCandidateOn from 'minterjs-tx/src/tx-data/set-candidate-on';
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
export default function SetCandidateOnTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    const txData = new TxDataSetCandidateOn({
        pubKey: toBuffer(publicKey),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SET_CANDIDATE_ON,
        txData: txData.serialize(),
    };
}
