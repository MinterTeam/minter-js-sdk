import {TxDataSetHaltBlock} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {dataToInteger, dataToPublicKey, integerToHexString, proxyNestedTxData, validateUint, validatePublicKey} from '../utils.js';


/**
 * @param {object} txData
 * @param {string} txData.publicKey
 * @param {number|string} txData.height
 * @param {TxOptions} [options]
 * @constructor
 */
export default function VoteHaltBlockTxData({publicKey, height}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateUint(height, 'height');
    }

    this.publicKey = publicKey;
    this.height = height;

    this.txData = new TxDataSetHaltBlock({
        publicKey: toBuffer(publicKey),
        height: integerToHexString(height),
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.publicKey
 * @param {Buffer|string|number} txData.height
 * @param {TxOptions} [options]
 * @return {VoteHaltBlockTxData}
 */
VoteHaltBlockTxData.fromBufferFields = function fromBufferFields({publicKey, height}, options = {}) {
    return new VoteHaltBlockTxData({
        publicKey: dataToPublicKey(publicKey),
        height: dataToInteger(height),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {VoteHaltBlockTxData}
 */
VoteHaltBlockTxData.fromRlp = function fromRlp(data) {
    return VoteHaltBlockTxData.fromBufferFields(new TxDataSetHaltBlock(data));
};
