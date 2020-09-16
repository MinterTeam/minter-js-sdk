import {TxDataSetHaltBlock} from 'minterjs-tx';
import {toBuffer, publicToString} from 'minterjs-util';
import {bufferToInteger, integerToHexString, addTxDataFields, validateUint, validatePublicKey} from '../utils.js';


/**
 *
 * @param {string} publicKey
 * @param {number|string} height
 * @constructor
 */
export default function SetHaltBlockTxData({publicKey, height}) {
    validatePublicKey(publicKey, 'publicKey');
    validateUint(height, 'height');

    this.publicKey = publicKey;
    this.height = height;

    this.txData = new TxDataSetHaltBlock({
        publicKey: toBuffer(publicKey),
        height: integerToHexString(height),
    });

    addTxDataFields(this);

    // proxy TxData
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} publicKey
 * @param {Buffer|string|number} height
 * @return {SetHaltBlockTxData}
 */
SetHaltBlockTxData.fromBufferFields = function fromBufferFields({publicKey, height}) {
    return new SetHaltBlockTxData({
        publicKey: publicToString(publicKey),
        height: bufferToInteger(toBuffer(height)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {SetHaltBlockTxData}
 */
SetHaltBlockTxData.fromRlp = function fromRlp(data) {
    return SetHaltBlockTxData.fromBufferFields(new TxDataSetHaltBlock(data));
};
