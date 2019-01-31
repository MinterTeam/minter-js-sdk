import MinterSellAllTxData from 'minterjs-tx/src/tx-data/sell-all';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {TX_TYPE_SELL_ALL_COIN} from 'minterjs-tx/src/tx-types';
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
    const txData = new MinterSellAllTxData({
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
