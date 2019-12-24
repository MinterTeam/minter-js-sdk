import {TxDataCreateMultisig} from 'minterjs-tx';
// import TxDataCreateMultisig from 'minterjs-tx/src/tx-data/create-multisig';
import {addressToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';
import {bufferToInteger, integerToHexString} from '../utils';

/**
 * @param {Array} addresses
 * @param {Array} weights
 * @param {number|string} threshold
 * @constructor
 */
export default function CreateMultisigTxData({addresses, weights, threshold}) {
    this.addresses = addresses;
    this.weights = weights;
    this.threshold = threshold;

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

    this.txData = new TxDataCreateMultisig({
        addresses: addresses.map((address) => toBuffer(address)),
        weights: weights.map((weight) => `0x${integerToHexString(weight)}`),
        threshold: `0x${integerToHexString(threshold)}`,
    });

    // proxy TxDataCreateMultisig
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 *
 * @param {Array<Buffer>} addresses
 * @param {Array<Buffer>} weights
 * @param {Buffer|string} threshold
 * @return {CreateMultisigTxData}
 */
CreateMultisigTxData.fromBufferFields = function fromBufferFields({addresses, weights, threshold}) {
    return new CreateMultisigTxData({
        addresses: addresses.map((item) => addressToString(item)),
        weights: weights.map((item) => bufferToInteger(item)),
        threshold: bufferToInteger(threshold),
    });
};

/**
 * @param {Buffer|string} data
 * @return {CreateMultisigTxData}
 */
CreateMultisigTxData.fromRlp = function fromRlp(data) {
    return CreateMultisigTxData.fromBufferFields(new TxDataCreateMultisig(data));
};
