import {TxDataAddLimitOrder} from 'minterjs-tx';
// import TxDataSell from 'minterjs-tx/src/tx-data/sell.js';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {number|string} coinToSell - coin id
 * @param {number|string} coinToBuy - coin id
 * @param {number|string} valueToSell
 * @param {number|string} valueToBuy
 * @param {TxOptions} [options]
 * @constructor
 */
export default function AddLimitOrderTxData({coinToSell, coinToBuy, valueToSell, valueToBuy = 0}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coinToSell, 'coinToSell');
        validateUint(coinToBuy, 'coinToBuy');
        validateAmount(valueToSell, 'valueToSell');
        validateAmount(valueToBuy, 'valueToBuy');
    }

    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.valueToSell = valueToSell;
    this.valueToBuy = valueToBuy;

    this.txData = new TxDataAddLimitOrder({
        coinToSell: integerToHexString(coinToSell),
        coinToBuy: integerToHexString(coinToBuy),
        valueToSell: `0x${convertToPip(valueToSell, 'hex')}`,
        valueToBuy: `0x${convertToPip(valueToBuy, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} coinToSell
 * @param {Buffer|string} valueToSell
 * @param {Buffer|string} coinToBuy
 * @param {Buffer|string} valueToBuy
 * @param {TxOptions} [options]
 * @return {AddLimitOrderTxData}
 */
AddLimitOrderTxData.fromBufferFields = function fromBufferFields({coinToSell, valueToSell, coinToBuy, valueToBuy}, options = {}) {
    // @TODO should validation be done here?
    /*
    if (!valueToSell && valueToSell !== 0) {
        throw new Error('Invalid valueToSell');
    }
    if (!valueToBuy && valueToBuy !== 0) {
        throw new Error('Invalid valueToBuy');
    }
    */

    return new AddLimitOrderTxData({
        coinToSell: dataToInteger(coinToSell),
        coinToBuy: dataToInteger(coinToBuy),
        valueToSell: dataPipToAmount(valueToSell),
        valueToBuy: dataPipToAmount(valueToBuy),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {AddLimitOrderTxData}
 */
AddLimitOrderTxData.fromRlp = function fromRlp(data) {
    return AddLimitOrderTxData.fromBufferFields(new TxDataAddLimitOrder(data));
};
