import {TxDataSellAllSwapPool} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, dataPipToAmount, validateAmount, validateUintArray} from '../utils.js';

/**
 * @param {Array<number|string>} coins - list of coin id
 * @param {number|string} [minimumValueToBuy=0]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function SellAllPoolTxData({coins, minimumValueToBuy = 0}, options = {}) {
    if (!options.disableValidation) {
        validateUintArray(coins, 'coins');
        validateAmount(minimumValueToBuy, 'minimumValueToBuy');
    }

    this.coins = coins;
    this.minimumValueToBuy = minimumValueToBuy;

    this.txData = new TxDataSellAllSwapPool({
        coins: coins.map((coin) => integerToHexString(coin)),
        minimumValueToBuy: `0x${convertToPip(minimumValueToBuy, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Array<Buffer>} coins
 * @param {Buffer|string} minimumValueToBuy
 * @param {TxOptions} [options]
 * @return {SellAllPoolTxData}
 */
SellAllPoolTxData.fromBufferFields = function fromBufferFields({coins, minimumValueToBuy}, options = {}) {
    return new SellAllPoolTxData({
        coins: coins.map((item) => bufferToInteger(item)),
        minimumValueToBuy: dataPipToAmount(minimumValueToBuy),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {SellAllPoolTxData}
 */
SellAllPoolTxData.fromRlp = function fromRlp(data) {
    return SellAllPoolTxData.fromBufferFields(new TxDataSellAllSwapPool(data));
};
