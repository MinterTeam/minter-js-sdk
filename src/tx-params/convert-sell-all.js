import {MinterTxDataSellAll, TX_TYPE_SELL_ALL_COIN, formatCoin} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';

/**
 * @constructor
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number|string} [minBuyAmount=0]
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SellAllTxParams({coinFrom, coinTo, minBuyAmount = 0, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataSellAll({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
        minimumValueToBuy: `0x${convertToPip(minBuyAmount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_ALL_COIN,
        txData: txData.serialize(),
    };
}
