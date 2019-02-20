import MinterCreateMultisigTxData from 'minterjs-tx/src/tx-data/create-multisig';
import {toBuffer} from 'minterjs-util/src/prefix';
import {TX_TYPE_CREATE_MULTISIG} from 'minterjs-tx/src/tx-types';
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
    const txData = new MinterCreateMultisigTxData({
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
