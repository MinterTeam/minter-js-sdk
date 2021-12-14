import {TxDataAddLimitOrder} from 'minterjs-tx';
// import TxDataSell from 'minterjs-tx/src/tx-data/sell.js';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import {convertToPip, convertFromPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {number|string} coinToSell - coin id
 * @param {number|string} coinToBuy - coin id
 * @param {number|string} valueToSell
 * @param {number|string} valueToBuy
 * @constructor
 */
export default function AddLimitOrderTxData({coinToSell, coinToBuy, valueToSell, valueToBuy = 0}) {
    validateUint(coinToSell, 'coinToSell');
    validateUint(coinToBuy, 'coinToBuy');
    validateAmount(valueToSell, 'valueToSell');
    validateAmount(valueToBuy, 'valueToBuy');

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
 * @return {AddLimitOrderTxData}
 */
AddLimitOrderTxData.fromBufferFields = function fromBufferFields({coinToSell, valueToSell, coinToBuy, valueToBuy}) {
    if (!valueToSell && valueToSell !== 0) {
        throw new Error('Invalid valueToSell');
    }
    if (!valueToBuy && valueToBuy !== 0) {
        throw new Error('Invalid valueToBuy');
    }

    return new AddLimitOrderTxData({
        coinToSell: bufferToInteger(toBuffer(coinToSell)),
        coinToBuy: bufferToInteger(toBuffer(coinToBuy)),
        valueToSell: convertFromPip(bufferToInteger(toBuffer(valueToSell))),
        valueToBuy: convertFromPip(bufferToInteger(toBuffer(valueToBuy))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {AddLimitOrderTxData}
 */
AddLimitOrderTxData.fromRlp = function fromRlp(data) {
    return AddLimitOrderTxData.fromBufferFields(new TxDataAddLimitOrder(data));
};
