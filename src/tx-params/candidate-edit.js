import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import EditCandidateTxData from '../tx-data/candidate-edit';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} rewardAddress
 * @param {string} ownerAddress
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function EditCandidateTxParams({publicKey, rewardAddress, ownerAddress, feeCoinSymbol, ...otherParams}) {
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
