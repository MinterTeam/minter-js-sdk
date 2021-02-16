import {TxDataBuySwapPool} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer, COIN_MAX_AMOUNT} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUintArray} from '../utils.js';

/**
 * @param {Array<number|string>} coins - list of coin id
 * @param {number|string} valueToBuy
 * @param {number|string} [maximumValueToSell]
 * @constructor
 */
export default function BuyPoolTxData({coins, valueToBuy, maximumValueToSell = COIN_MAX_AMOUNT}) {
    validateUintArray(coins, 'coins');
    validateAmount(valueToBuy, 'valueToBuy');
    validateAmount(maximumValueToSell, 'maximumValueToSell');

    this.coins = coins;
    this.valueToBuy = valueToBuy;
    this.maximumValueToSell = maximumValueToSell;

    this.txData = new TxDataBuySwapPool({
        coins: coins.map((coin) => integerToHexString(coin)),
        valueToBuy: `0x${convertToPip(valueToBuy, 'hex')}`,
        maximumValueToSell: `0x${convertToPip(maximumValueToSell, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Array<Buffer>} coins
 * @param {Buffer|string} valueToBuy
 * @param {Buffer|string} maximumValueToSell
 * @return {BuyPoolTxData}
 */
BuyPoolTxData.fromBufferFields = function fromBufferFields({coins, valueToBuy, maximumValueToSell}) {
    return new BuyPoolTxData({
        coins: coins.map((item) => bufferToInteger(item)),
        valueToBuy: convertFromPip(bufferToInteger(toBuffer(valueToBuy))),
        maximumValueToSell: convertFromPip(bufferToInteger(toBuffer(maximumValueToSell))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {BuyPoolTxData}
 */
BuyPoolTxData.fromRlp = function fromRlp(data) {
    return BuyPoolTxData.fromBufferFields(new TxDataBuySwapPool(data));
};
