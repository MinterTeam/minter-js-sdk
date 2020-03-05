import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import SellAllTxData from '../tx-data/convert-sell-all.js';

/**
 * @deprecated
 * @constructor
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number|string} [minBuyAmount=0]
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SellAllTxParams({coinFrom, coinTo, minBuyAmount = 0, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('SellAllTxParams is deprecated');

    const txData = new SellAllTxData({
        coinToSell: coinFrom,
        coinToBuy: coinTo,
        minimumValueToBuy: minBuyAmount,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SELL_ALL,
        txData: txData.serialize(),
    };
}
