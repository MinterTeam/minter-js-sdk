import MinterBuyTxData from 'minterjs-tx/src/tx-data/buy';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util/src/converter';
import {TX_TYPE_BUY_COIN} from 'minterjs-tx/src/tx-types';

/**
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
    const txData = new MinterBuyTxData({
        coinToSell: formatCoin(coinFrom),
        coinToBuy: formatCoin(coinTo),
        valueToBuy: `0x${convertToPip(buyAmount, 'hex')}`,
        maximumValueToSell: `0x${convertToPip(maxSellAmount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_BUY_COIN,
        txData: txData.serialize(),
    };
}