import {TxDataBuy, TX_TYPE, coinToBuffer} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import BuyTxData from '../tx-data/convert-buy.js';

/**
 * @deprecated
 * @constructor
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number|string} buyAmount
 * @param {number|string} [maxSellAmount]
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function BuyTxParams({coinFrom, coinTo, buyAmount, maxSellAmount = Number.MAX_SAFE_INTEGER, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('BuyTxParams is deprecated');

    const txData = new BuyTxData({
        coinToSell: coinFrom,
        coinToBuy: coinTo,
        valueToBuy: buyAmount,
        maximumValueToSell: maxSellAmount,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.BUY,
        txData: txData.serialize(),
    };
}
