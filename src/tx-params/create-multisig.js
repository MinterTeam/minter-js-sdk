import MinterCreateMultisigTxData from 'minterjs-tx/src/tx-data/create-multisig';
import {padToEven} from 'ethjs-util';
import {toBuffer} from 'minterjs-util';
import {TX_TYPE_CREATE_MULTISIG} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {Array} addresses
 * @param {Array} weights
 * @param {number} threshold
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export default function CreateMultisigTxParams({privateKey, addresses, weights, threshold, feeCoinSymbol, message}) {
    const txData = new MinterCreateMultisigTxData({
        addresses: addresses.map((address) => toBuffer(address)),
        weights: weights.map((weight) => `0x${padToEven(Number(weight).toString(16))}`),
        threshold: `0x${padToEven(Number(threshold).toString(16))}`,
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_CREATE_MULTISIG,
        txData: txData.serialize(),
    };
}
