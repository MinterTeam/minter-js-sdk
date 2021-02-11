import {TxDataEditTickerOwner} from 'minterjs-tx';
import {toBuffer, coinToBuffer, bufferToCoin, addressToString} from 'minterjs-util';
import {proxyNestedTxData, validateAddress, validateTicker} from '../utils.js';

/**
 * @param {string} symbol
 * @param {string} newOwner
 * @constructor
 */
export default function EditTickerOwnerTxData({symbol, newOwner}) {
    validateTicker(symbol, 'symbol');
    validateAddress(newOwner, 'newOwner');

    this.symbol = symbol;
    this.newOwner = newOwner;

    this.txData = new TxDataEditTickerOwner({
        symbol: coinToBuffer(symbol),
        newOwner: toBuffer(newOwner),
    });

    proxyNestedTxData(this);
}

/**
 *
 * @param {Buffer|string} symbol
 * @param {Buffer|string} newOwner
 * @return {EditTickerOwnerTxData}
 */
EditTickerOwnerTxData.fromBufferFields = function fromBufferFields({symbol, newOwner}) {
    return new EditTickerOwnerTxData({
        symbol: bufferToCoin(toBuffer(symbol)),
        newOwner: addressToString(newOwner),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditTickerOwnerTxData}
 */
EditTickerOwnerTxData.fromRlp = function fromRlp(data) {
    return EditTickerOwnerTxData.fromBufferFields(new TxDataEditTickerOwner(data));
};
