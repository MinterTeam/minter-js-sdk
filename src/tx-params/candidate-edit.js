import MinterEditCandidateTxData from 'minterjs-tx/src/tx-data/edit-candidate';
import {TX_TYPE_EDIT_CANDIDATE} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';

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
    const txData = new MinterEditCandidateTxData({
        pubKey: toBuffer(publicKey),
        rewardAddress: toBuffer(rewardAddress),
        ownerAddress: toBuffer(ownerAddress),
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_EDIT_CANDIDATE,
        txData: txData.serialize(),
    };
}
