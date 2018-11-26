import MinterSellTxData from 'minterjs-tx/src/tx-data/sell';
import {formatCoin} from 'minterjs-tx/src/helpers';
import converter from 'minterjs-tx/src/converter';
import {TX_TYPE_SELL_COIN} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number} sellAmount
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export default function SellTxParams({privateKey, coinFrom, coinTo, sellAmount, feeCoinSymbol, message}) {
    const txData = new MinterSellTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
        valueToSell: `0x${converter.convert(sellAmount, 'pip').toString(16)}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_COIN,
        txData: txData.serialize(),
    };
}
