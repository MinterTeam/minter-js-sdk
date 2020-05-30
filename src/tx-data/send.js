import {TxDataSend, coinToBuffer, bufferToCoin} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer, addressToString} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {bufferToInteger, addTxDataFields, validateAddress, validateCoin, validateAmount} from '../utils.js';


/**
 *
 * @param {string} to
 * @param {number|string} value
 * @param {string} coin
 * @constructor
 */
export default function SendTxData({to, value = 0, coin}) {
    validateAddress(to, 'to');
    validateCoin(coin, 'coin');
    validateAmount(value, 'value');

    this.to = to;
    this.value = value;
    this.coin = coin;

    this.txData = new TxDataSend({
        to: toBuffer(to),
        coin: coinToBuffer(coin),
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
    if (Buffer.isBuffer(value)) {
        value = bufferToInteger(value);
    }
    return new SendTxData({
        to: addressToString(to),
        coin: bufferToCoin(toBuffer(coin)),
        value: convertFromPip(value),
    });
};

/**
 * @param {Buffer|string} data
 * @return {SendTxData}
 */
SendTxData.fromRlp = function fromRlp(data) {
    return SendTxData.fromBufferFields(new TxDataSend(data));
};
