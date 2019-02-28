import {MinterTxDataCreateMultisig, TX_TYPE_CREATE_MULTISIG} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {toHexString} from '../utils';

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
    const txData = new MinterTxDataCreateMultisig({
        addresses: addresses.map((address) => toBuffer(address)),
        weights: weights.map((weight) => `0x${toHexString(weight)}`),
        threshold: `0x${toHexString(threshold)}`,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_CREATE_MULTISIG,
        txData: txData.serialize(),
    };
}
