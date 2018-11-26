import MinterSellAllTxData from 'minterjs-tx/src/tx-data/sell-all';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {TX_TYPE_SELL_ALL_COIN} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export default function SellAllTxParams({privateKey, coinFrom, coinTo, feeCoinSymbol, message}) {
    const txData = new MinterSellAllTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_ALL_COIN,
        txData: txData.serialize(),
    };
}
