import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import SellTxData from '../tx-data/convert-sell.js';

/**
 * @deprecated
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
    // eslint-disable-next-line no-console
    console.warn('SellTxParams is deprecated');

    const txData = new SellTxData({
        coinToSell: coinFrom,
        coinToBuy: coinTo,
        valueToSell: sellAmount,
        minimumValueToBuy: minBuyAmount,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SELL,
        txData: txData.serialize(),
    };
}
