import {TxDataEditMultisig} from 'minterjs-tx';
import {addressToString, toBuffer} from 'minterjs-util';
import {addTxDataFields, bufferToInteger, integerToHexString, validateAddress, validateUint} from '../utils.js';

/**
 * @param {Array} addresses
 * @param {Array} weights
 * @param {number|string} threshold
 * @constructor
 */
export default function EditMultisigTxData({addresses, weights, threshold}) {
    this.addresses = addresses;
    this.weights = weights;
    this.threshold = threshold;

    if (!Array.isArray(addresses)) {
        throw new Error('Field `addresses` is not an array');
    }
    if (!Array.isArray(weights)) {
        throw new Error('Field `weights` is not an array');
    }
    if (addresses.length > 32) {
        throw new Error('Invalid `addresses` count, it must not be greater than 32');
    }
    if (weights.length !== addresses.length) {
        throw new Error('Invalid `weights` count, it must be equal to addresses count');
    }
    addresses.forEach((address, index) => {
        try {
            validateAddress(address, `addresses[${index}]`);
        } catch (e) {
            throw new Error(`Field \`addresses\` contains invalid address at index: ${index}. ${e.message}`);
        }
    });

    weights.forEach((weight, index) => {
        if (weight > 1023 || weight < 0) {
            throw new Error(`\`weights\` field contains invalid weight at index: ${index}, it should be between 0 and 1023`);
        }
        try {
            validateUint(weight, 'weights');
        } catch (e) {
            // update error message
            throw new Error(e.message.replace('`weights`', `\`weights\` contain invalid weight at index: ${index}, it `));
        }
    });

    this.txData = new TxDataEditMultisig({
        addresses: addresses.map((address) => toBuffer(address)),
        weights: weights.map((weight) => integerToHexString(weight)),
        threshold: integerToHexString(threshold),
    });

    addTxDataFields(this);

    // proxy TxData
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 *
 * @param {Array<Buffer>} addresses
 * @param {Array<Buffer>} weights
 * @param {Buffer|string} threshold
 * @return {EditMultisigTxData}
 */
EditMultisigTxData.fromBufferFields = function fromBufferFields({addresses, weights, threshold}) {
    return new EditMultisigTxData({
        addresses: addresses.map((item) => addressToString(item)),
        weights: weights.map((item) => bufferToInteger(item)),
        threshold: bufferToInteger(threshold),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditMultisigTxData}
 */
EditMultisigTxData.fromRlp = function fromRlp(data) {
    return EditMultisigTxData.fromBufferFields(new TxDataEditMultisig(data));
};
