import MinterEditCandidateTxData from 'minterjs-tx/src/tx-data/edit-candidate';
import {TX_TYPE_EDIT_CANDIDATE} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string} rewardAddress
 * @param {string} ownerAddress
 * @param {string} feeCoinSymbol
 * @param {string} [message]
 * @return {TxParams}
 */
export default function EditCandidateTxParams({privateKey, publicKey, rewardAddress, ownerAddress, feeCoinSymbol, message}) {
    const txData = new MinterEditCandidateTxData({
        pubKey: toBuffer(publicKey),
        rewardAddress: toBuffer(rewardAddress),
        ownerAddress: toBuffer(ownerAddress),
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_EDIT_CANDIDATE,
        txData: txData.serialize(),
    };
}
