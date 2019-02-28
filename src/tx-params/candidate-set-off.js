import {MinterTxDataSetCandidateOff, TX_TYPE_SET_CANDIDATE_OFF} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SetCandidateOffTxParams({publicKey, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataSetCandidateOff({
        pubKey: toBuffer(publicKey),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SET_CANDIDATE_OFF,
        txData: txData.serialize(),
    };
}
