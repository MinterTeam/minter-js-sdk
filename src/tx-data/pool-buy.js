import {TxDataBuySwapPool} from 'minterjs-tx';
import {convertToPip, COIN_MAX_AMOUNT} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, dataPipToAmount, validateAmount, validateUintArray} from '../utils.js';

/**
 * @param {object} txData
 * @param {Array<number|string>} txData.coins - list of coin id
 * @param {number|string} txData.valueToBuy
 * @param {number|string} [txData.maximumValueToSell]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function BuyPoolTxData({coins, valueToBuy, maximumValueToSell = COIN_MAX_AMOUNT}, options = {}) {
    if (!options.disableValidation) {
        validateUintArray(coins, 'coins');
        validateAmount(valueToBuy, 'valueToBuy');
        validateAmount(maximumValueToSell, 'maximumValueToSell');
    }

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
 * @param {object} txData
 * @param {Array<Buffer>} txData.coins
 * @param {Buffer|string} txData.valueToBuy
 * @param {Buffer|string} txData.maximumValueToSell
 * @param {TxOptions} [options]
 * @return {BuyPoolTxData}
 */
BuyPoolTxData.fromBufferFields = function fromBufferFields({coins, valueToBuy, maximumValueToSell}, options = {}) {
    return new BuyPoolTxData({
        coins: coins.map((item) => bufferToInteger(item)),
        valueToBuy: dataPipToAmount(valueToBuy),
        maximumValueToSell: dataPipToAmount(maximumValueToSell),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {BuyPoolTxData}
 */
BuyPoolTxData.fromRlp = function fromRlp(data) {
    return BuyPoolTxData.fromBufferFields(new TxDataBuySwapPool(data));
};
