import {TxDataSend} from 'minterjs-tx';
import {convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {dataToInteger, dataPipToAmount, dataToAddress, integerToHexString, proxyNestedTxData, validateAddress, validateUint, validateAmount} from '../utils.js';


/**
 *
 * @param {string} to
 * @param {number|string} value
 * @param {number|string} coin - coin id
 * @param {TxOptions} [options]
 * @constructor
 */
export default function SendTxData({to, value = 0, coin}, options = {}) {
    if (!options.disableValidation) {
        validateAddress(to, 'to');
        validateUint(coin, 'coin');
        validateAmount(value, 'value');
    }

    this.to = to;
    this.value = value;
    this.coin = coin;

    this.txData = new TxDataSend({
        to: toBuffer(to),
        coin: integerToHexString(coin),
        value: `0x${convertToPip(value, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} to
 * @param {Buffer|string|number} value
 * @param {Buffer|string|number} coin
 * @param {TxOptions} [options]
 * @return {SendTxData}
 */
SendTxData.fromBufferFields = function fromBufferFields({to, value, coin}, options = {}) {
    return new SendTxData({
        to: dataToAddress(to),
        coin: dataToInteger(coin),
        value: dataPipToAmount(value),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {SendTxData}
 */
SendTxData.fromRlp = function fromRlp(data) {
    return SendTxData.fromBufferFields(new TxDataSend(data));
};
