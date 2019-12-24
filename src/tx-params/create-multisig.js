import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import CreateMultisigTxData from '../tx-data/create-multisig';

/**
 * @constructor
 * @param {Array} addresses
 * @param {Array} weights
 * @param {number|string} threshold
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function CreateMultisigTxParams({addresses, weights, threshold, feeCoinSymbol, ...otherParams}) {
    const txData = new CreateMultisigTxData({
        addresses,
        weights,
        threshold,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.CREATE_MULTISIG,
        txData: txData.serialize(),
    };
}
