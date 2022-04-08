import {TxDataEditMultisig} from 'minterjs-tx';
import {addressToString, toBuffer} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAddress, validateUint, validateUintArray} from '../utils.js';

/**
 * @param {object} txData
 * @param {Array} txData.addresses
 * @param {Array} txData.weights
 * @param {number|string} txData.threshold
 * @param {TxOptions} [options]
 * @constructor
 */
export default function EditMultisigTxData({addresses, weights, threshold}, options = {}) {
    if (!options.disableValidation) {
        validateUintArray(weights, 'weights');
        validateUint(threshold);
    }

    this.addresses = addresses;
    this.weights = weights;
    this.threshold = threshold;

    if (!Array.isArray(addresses)) {
        throw new TypeError('Field `addresses` is not an array');
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
        } catch (error) {
            throw new Error(`Field \`addresses\` contains invalid address at index: ${index}. ${error.message}`);
        }
    });

    weights.forEach((weight, index) => {
        if (weight > 1023 || weight < 0) {
            throw new Error(`\`weights\` field contains invalid weight at index: ${index}, it should be between 0 and 1023`);
        }
    });

    // sort arrays so different ordered lists will produce same transaction hash
    const list = addresses.map((item, index) => {
        return {
            address: item,
            weight: weights[index],
        };
    });
    list.sort(function sortListItem(a, b) {
        if (a.address > b.address) {
            return 1;
        }
        if (a.address < b.address) {
            return -1;
        }
        return 0;
    });
    addresses = list.map((item) => item.address);
    weights = list.map((item) => item.weight);

    this.txData = new TxDataEditMultisig({
        addresses: addresses.map((address) => toBuffer(address)),
        weights: weights.map((weight) => integerToHexString(weight)),
        threshold: integerToHexString(threshold),
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Array<Buffer>} txData.addresses
 * @param {Array<Buffer>} txData.weights
 * @param {Buffer|string} txData.threshold
 * @param {TxOptions} [options]
 * @return {EditMultisigTxData}
 */
EditMultisigTxData.fromBufferFields = function fromBufferFields({addresses, weights, threshold}, options = {}) {
    return new EditMultisigTxData({
        // @TODO replace with dataToXXX methods?
        addresses: addresses.map((item) => addressToString(item)),
        weights: weights.map((item) => bufferToInteger(item)),
        threshold: bufferToInteger(threshold),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {EditMultisigTxData}
 */
EditMultisigTxData.fromRlp = function fromRlp(data) {
    return EditMultisigTxData.fromBufferFields(new TxDataEditMultisig(data));
};
