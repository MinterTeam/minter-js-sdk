import {TxDataBuy} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer, COIN_MAX_AMOUNT} from 'minterjs-util';
import {addTxDataFields, bufferToInteger, integerToHexString, validateAmount, validateUint} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {number|string} coinToSell - coin id
 * @param {number|string} coinToBuy - coin id
 * @param {number|string} valueToBuy
 * @param {number|string} [maximumValueToSell]
 * @constructor
 */
export default function BuyTxData({coinToSell, coinToBuy, valueToBuy, maximumValueToSell = COIN_MAX_AMOUNT}) {
    validateUint(coinToSell, 'coinToSell');
    validateUint(coinToBuy, 'coinToBuy');
    validateAmount(valueToBuy, 'valueToBuy');
    validateAmount(maximumValueToSell, 'maximumValueToSell');

    this.coinToSell = coinToSell;
    this.coinToBuy = coinToBuy;
    this.valueToBuy = valueToBuy;
    this.maximumValueToSell = maximumValueToSell;

    this.txData = new TxDataBuy({
        coinToSell: integerToHexString(coinToSell),
        coinToBuy: integerToHexString(coinToBuy),
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
        coinToSell: bufferToInteger(toBuffer(coinToSell)),
        coinToBuy: bufferToInteger(toBuffer(coinToBuy)),
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
