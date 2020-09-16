import {TxDataEditCoinOwner} from 'minterjs-tx';
import {toBuffer, coinToBuffer, bufferToCoin, addressToString} from 'minterjs-util';
import {addTxDataFields, validateAddress, validateCoin} from '../utils.js';

/**
 * @param {string} symbol
 * @param {string} newOwner
 * @constructor
 */
export default function EditCoinOwnerTxData({symbol, newOwner}) {
    validateCoin(symbol, 'symbol');
    validateAddress(newOwner, 'newOwner');

    this.symbol = symbol;
    this.newOwner = newOwner;

    this.txData = new TxDataEditCoinOwner({
        symbol: coinToBuffer(symbol),
        newOwner: toBuffer(newOwner),
    });

    addTxDataFields(this);

    // proxy TxData
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 *
 * @param {Buffer|string} symbol
 * @param {Buffer|string} newOwner
 * @return {EditCoinOwnerTxData}
 */
EditCoinOwnerTxData.fromBufferFields = function fromBufferFields({symbol, newOwner}) {
    return new EditCoinOwnerTxData({
        symbol: bufferToCoin(toBuffer(symbol)),
        newOwner: addressToString(newOwner),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditCoinOwnerTxData}
 */
EditCoinOwnerTxData.fromRlp = function fromRlp(data) {
    return EditCoinOwnerTxData.fromBufferFields(new TxDataEditCoinOwner(data));
};
