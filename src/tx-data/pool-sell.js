import {TxDataSellSwapPool} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, dataPipToAmount, validateAmount, validateUintArray} from '../utils.js';

/**
 * @param {object} txData
 * @param {Array<number|string>} txData.coins - list of coin id
 * @param {number|string} txData.valueToSell
 * @param {number|string} [txData.minimumValueToBuy=0]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function SellPoolTxData({coins, valueToSell, minimumValueToBuy = 0}, options = {}) {
    if (!options.disableValidation) {
        validateUintArray(coins, 'coins');
        validateAmount(valueToSell, 'valueToSell');
        validateAmount(minimumValueToBuy, 'minimumValueToBuy');
    }

    this.coins = coins;
    this.valueToSell = valueToSell;
    this.minimumValueToBuy = minimumValueToBuy;

    this.txData = new TxDataSellSwapPool({
        coins: coins.map((coin) => integerToHexString(coin)),
        valueToSell: `0x${convertToPip(valueToSell, 'hex')}`,
        minimumValueToBuy: `0x${convertToPip(minimumValueToBuy, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Array<Buffer>} txData.coins
 * @param {Buffer|string} txData.valueToSell
 * @param {Buffer|string} txData.minimumValueToBuy
 * @param {TxOptions} [options]
 * @return {SellPoolTxData}
 */
SellPoolTxData.fromBufferFields = function fromBufferFields({coins, valueToSell, minimumValueToBuy}, options = {}) {
    // @TODO should validation be done here?
    /*
    if (!valueToSell && valueToSell !== 0) {
        throw new Error('Invalid valueToSell');
    }
     */

    return new SellPoolTxData({
        coins: coins.map((item) => bufferToInteger(item)),
        valueToSell: dataPipToAmount(valueToSell),
        minimumValueToBuy: dataPipToAmount(minimumValueToBuy),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {SellPoolTxData}
 */
SellPoolTxData.fromRlp = function fromRlp(data) {
    return SellPoolTxData.fromBufferFields(new TxDataSellSwapPool(data));
};
