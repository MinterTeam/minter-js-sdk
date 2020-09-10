import {TxDataSend} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, addressToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {bufferToInteger, integerToHexString, addTxDataFields, validateAddress, validateUint, validateAmount} from '../utils.js';


/**
 *
 * @param {string} to
 * @param {number|string} value
 * @param {number|string} coin - coin id
 * @constructor
 */
export default function SendTxData({to, value = 0, coin}) {
    validateAddress(to, 'to');
    validateUint(coin, 'coin');
    validateAmount(value, 'value');

    this.to = to;
    this.value = value;
    this.coin = coin;

    this.txData = new TxDataSend({
        to: toBuffer(to),
        coin: integerToHexString(coin),
        value: `0x${convertToPip(value, 'hex')}`,
    });

    addTxDataFields(this);

    // proxy TxDataSend
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} to
 * @param {Buffer|string|number} value
 * @param {Buffer|string|number} coin
 * @return {SendTxData}
 */
SendTxData.fromBufferFields = function fromBufferFields({to, value, coin}) {
    return new SendTxData({
        to: addressToString(to),
        coin: bufferToInteger(toBuffer(coin)),
        value: convertFromPip(bufferToInteger(toBuffer(value))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {SendTxData}
 */
SendTxData.fromRlp = function fromRlp(data) {
    return SendTxData.fromBufferFields(new TxDataSend(data));
};
