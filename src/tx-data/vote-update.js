import {TxDataVoteUpdate} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {dataToInteger, dataToPublicKey, integerToHexString, proxyNestedTxData, validateUint, validatePublicKey} from '../utils.js';


/**
 * @param {object} txData
 * @param {string} txData.version
 * @param {string} txData.publicKey
 * @param {number|string} txData.height
 * @param {TxOptions} [options]
 * @constructor
 */
export default function VoteUpdateTxData({version, publicKey, height}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateUint(height, 'height');
    }

    this.version = version;
    this.publicKey = publicKey;
    this.height = height;

    this.txData = new TxDataVoteUpdate({
        version: Buffer.from(version.toString(), 'utf8'),
        publicKey: toBuffer(publicKey),
        height: integerToHexString(height),
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txTata
 * @param {Buffer|string} txTata.version
 * @param {Buffer|string} txTata.publicKey
 * @param {Buffer|string|number} txTata.height
 * @param {TxOptions} [options]
 * @return {VoteUpdateTxData}
 */
VoteUpdateTxData.fromBufferFields = function fromBufferFields({version, publicKey, height}, options = {}) {
    return new VoteUpdateTxData({
        version: toBuffer(version).toString('utf8'),
        publicKey: dataToPublicKey(publicKey),
        height: dataToInteger(height),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {VoteUpdateTxData}
 */
VoteUpdateTxData.fromRlp = function fromRlp(data) {
    return VoteUpdateTxData.fromBufferFields(new TxDataVoteUpdate(data));
};
