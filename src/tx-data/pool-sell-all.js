import {TxDataSellAllSwapPool} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUintArray} from '../utils.js';

/**
 * @param {Array<number|string>} coins - list of coin id
 * @param {number|string} [minimumValueToBuy=0]
 * @constructor
 */
export default function SellAllPoolTxData({coins, minimumValueToBuy = 0}) {
    validateUintArray(coins, 'coins');
    validateAmount(minimumValueToBuy, 'minimumValueToBuy');

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
 * @return {SellAllPoolTxData}
 */
SellAllPoolTxData.fromBufferFields = function fromBufferFields({coins, minimumValueToBuy}) {
    return new SellAllPoolTxData({
        coins: coins.map((item) => bufferToInteger(item)),
        minimumValueToBuy: convertFromPip(bufferToInteger(toBuffer(minimumValueToBuy))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {SellAllPoolTxData}
 */
SellAllPoolTxData.fromRlp = function fromRlp(data) {
    return SellAllPoolTxData.fromBufferFields(new TxDataSellAllSwapPool(data));
};
