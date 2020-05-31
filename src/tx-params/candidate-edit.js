import {TX_TYPE} from 'minterjs-util';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import EditCandidateTxData from '../tx-data/candidate-edit.js';

/**
 * @deprecated
 * @constructor
 * @param {string} publicKey
 * @param {string} rewardAddress
 * @param {string} ownerAddress
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function EditCandidateTxParams({publicKey, rewardAddress, ownerAddress, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('EditCandidateTxParams is deprecated');

    const txData = new EditCandidateTxData({
        publicKey,
        rewardAddress,
        ownerAddress,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.EDIT_CANDIDATE,
        txData: txData.serialize(),
    };
}
