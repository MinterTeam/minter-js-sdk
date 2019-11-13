import {MinterTxDataSetCandidateOn, TX_TYPE_SET_CANDIDATE_ON} from 'minterjs-tx';
// import MinterTxDataSetCandidateOn from 'minterjs-tx/src/tx-data/set-candidate-on';
// import {TX_TYPE_SET_CANDIDATE_ON} from 'minterjs-tx/src/tx-types';
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
    const txData = new MinterTxDataSetCandidateOn({
        pubKey: toBuffer(publicKey),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_ON,
        txData: txData.serialize(),
    };
}
