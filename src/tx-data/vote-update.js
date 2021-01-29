import {TxDataVoteUpdate} from 'minterjs-tx';
import {toBuffer, publicToString} from 'minterjs-util';
import {bufferToInteger, integerToHexString, proxyNestedTxData, validateUint, validatePublicKey} from '../utils.js';


/**
 * @param {string} version
 * @param {string} publicKey
 * @param {number|string} height
 * @constructor
 */
export default function VoteUpdateTxData({version, publicKey, height}) {
    validatePublicKey(publicKey, 'publicKey');
    validateUint(height, 'height');

    this.version = version;
    this.publicKey = publicKey;
    this.height = height;

    this.txData = new TxDataVoteUpdate({
        version: Buffer.from(version.toString(), 'utf-8'),
        publicKey: toBuffer(publicKey),
        height: integerToHexString(height),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} version
 * @param {Buffer|string} publicKey
 * @param {Buffer|string|number} height
 * @return {VoteUpdateTxData}
 */
VoteUpdateTxData.fromBufferFields = function fromBufferFields({version, publicKey, height}) {
    return new VoteUpdateTxData({
        version: toBuffer(version).toString('utf-8'),
        publicKey: publicToString(publicKey),
        height: bufferToInteger(toBuffer(height)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {VoteUpdateTxData}
 */
VoteUpdateTxData.fromRlp = function fromRlp(data) {
    return VoteUpdateTxData.fromBufferFields(new TxDataVoteUpdate(data));
};
