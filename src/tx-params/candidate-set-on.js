import {MinterTxDataSetCandidateOn, TX_TYPE_SET_CANDIDATE_ON} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';

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
