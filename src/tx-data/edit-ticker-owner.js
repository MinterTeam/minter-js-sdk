import {TxDataEditTickerOwner} from 'minterjs-tx';
import {toBuffer, coinToBuffer, bufferToCoin} from 'minterjs-util';
import {dataToAddress, proxyNestedTxData, validateAddress, validateTicker} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} txData.symbol
 * @param {string} txData.newOwner
 * @param {TxOptions} [options]
 * @constructor
 */
export default function EditTickerOwnerTxData({symbol, newOwner}, options = {}) {
    if (!options.disableValidation) {
        validateTicker(symbol, 'symbol');
        validateAddress(newOwner, 'newOwner');
    }

    this.symbol = symbol;
    this.newOwner = newOwner;

    this.txData = new TxDataEditTickerOwner({
        symbol: coinToBuffer(symbol),
        newOwner: toBuffer(newOwner),
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.symbol
 * @param {Buffer|string} txData.newOwner
 * @param {TxOptions} [options]
 * @return {EditTickerOwnerTxData}
 */
EditTickerOwnerTxData.fromBufferFields = function fromBufferFields({symbol, newOwner}, options = {}) {
    return new EditTickerOwnerTxData({
        symbol: bufferToCoin(toBuffer(symbol)),
        newOwner: dataToAddress(newOwner),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {EditTickerOwnerTxData}
 */
EditTickerOwnerTxData.fromRlp = function fromRlp(data) {
    return EditTickerOwnerTxData.fromBufferFields(new TxDataEditTickerOwner(data));
};
