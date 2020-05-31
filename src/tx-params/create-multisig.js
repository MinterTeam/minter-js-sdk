import {TX_TYPE} from 'minterjs-util';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import CreateMultisigTxData from '../tx-data/create-multisig.js';

/**
 * @deprecated
 * @constructor
 * @param {Array} addresses
 * @param {Array} weights
 * @param {number|string} threshold
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function CreateMultisigTxParams({addresses, weights, threshold, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('CreateMultisigTxParams is deprecated');

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
