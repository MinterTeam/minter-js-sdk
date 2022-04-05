import {TxDataSetHaltBlock} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {dataToInteger, dataToPublicKey, integerToHexString, proxyNestedTxData, validateUint, validatePublicKey} from '../utils.js';


/**
 * @param {string} publicKey
 * @param {number|string} height
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
 * @param {Buffer|string} publicKey
 * @param {Buffer|string|number} height
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
