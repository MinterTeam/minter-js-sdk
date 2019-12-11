import {TxDataCreateMultisig, TX_TYPE} from 'minterjs-tx';
// import TxDataCreateMultisig from 'minterjs-tx/src/tx-data/create-multisig';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {integerToHexString} from '../utils';

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
    if (addresses.length > 32) {
        throw new Error('Invalid addresses count, it must not be greater than 32');
    }
    if (weights.length !== addresses.length) {
        throw new Error('Invalid weights count, it must be equal to addresses count');
    }
    weights.forEach((weight) => {
        if (weight > 1023 || weight < 0) {
            throw new Error('Invalid weight given, it should be between 0 and 1023');
        }
    });
    const txData = new TxDataCreateMultisig({
        addresses: addresses.map((address) => toBuffer(address)),
        weights: weights.map((weight) => `0x${integerToHexString(weight)}`),
        threshold: `0x${integerToHexString(threshold)}`,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.CREATE_MULTISIG,
        txData: txData.serialize(),
    };
}
