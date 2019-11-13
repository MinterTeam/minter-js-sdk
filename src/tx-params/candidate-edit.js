import {MinterTxDataEditCandidate, TX_TYPE_EDIT_CANDIDATE} from 'minterjs-tx';
// import MinterTxDataEditCandidate from 'minterjs-tx/src/tx-data/edit-candidate';
// import {TX_TYPE_EDIT_CANDIDATE} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';

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
    const txData = new MinterTxDataEditCandidate({
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
