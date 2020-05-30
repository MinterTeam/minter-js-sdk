import {TxDataBuy, coinToBuffer, bufferToCoin} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer} from 'minterjs-util';
import {addTxDataFields, bufferToInteger, NETWORK_MAX_AMOUNT, validateAddress, validateAmount, validateCoin} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {string} coinToSell
 * @param {string} coinToBuy
 * @param {number|string} valueToBuy
 * @param {number|string} [maximumValueToSell]
 * @constructor
 */
export default function BuyTxData({coinToSell, coinToBuy, valueToBuy, maximumValueToSell = NETWORK_MAX_AMOUNT}) {
    validateCoin(coinToSell, 'coinToSell');
    validateCoin(coinToBuy, 'coinToBuy');
    validateAmount(valueToBuy, 'valueToBuy');
    validateAmount(maximumValueToSell, 'maximumValueToSell');

    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.valueToBuy = valueToBuy;
    this.maximumValueToSell = maximumValueToSell;

    this.txData = new TxDataBuy({
        coinToSell: coinToBuffer(coinToSell),
        coinToBuy: coinToBuffer(coinToBuy),
        valueToBuy: `0x${convertToPip(valueToBuy, 'hex')}`,
        maximumValueToSell: `0x${convertToPip(maximumValueToSell, 'hex')}`,
    });

    addTxDataFields(this);

    // proxy TxDataBuy
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} coinToSell
 * @param {Buffer|string} valueToBuy
 * @param {Buffer|string} coinToBuy
 * @param {Buffer|string} maximumValueToSell
 * @return {BuyTxData}
 */
BuyTxData.fromBufferFields = function fromBufferFields({coinToSell, valueToBuy, coinToBuy, maximumValueToSell}) {
    return new BuyTxData({
        coinToSell: bufferToCoin(toBuffer(coinToSell)),
        coinToBuy: bufferToCoin(toBuffer(coinToBuy)),
        valueToBuy: convertFromPip(bufferToInteger(toBuffer(valueToBuy))),
        maximumValueToSell: convertFromPip(bufferToInteger(toBuffer(maximumValueToSell))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {BuyTxData}
 */
BuyTxData.fromRlp = function fromRlp(data) {
    return BuyTxData.fromBufferFields(new TxDataBuy(data));
};
