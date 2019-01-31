import MinterSellTxData from 'minterjs-tx/src/tx-data/sell';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util/src/converter';
import {TX_TYPE_SELL_COIN} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number|string} sellAmount
 * @param {number|string} [minBuyAmount=0]
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SellTxParams({coinFrom, coinTo, sellAmount, minBuyAmount = 0, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterSellTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
        valueToSell: `0x${convertToPip(sellAmount, 'hex')}`,
        minimumValueToBuy: `0x${convertToPip(minBuyAmount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_COIN,
        txData: txData.serialize(),
    };
}
