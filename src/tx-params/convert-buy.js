import {TX_TYPE} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import BuyTxData from '../tx-data/convert-buy.js';
import {NETWORK_MAX_AMOUNT} from '../utils.js';

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
export default function BuyTxParams({coinFrom, coinTo, buyAmount, maxSellAmount = NETWORK_MAX_AMOUNT, feeCoinSymbol, ...otherParams}) {
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
