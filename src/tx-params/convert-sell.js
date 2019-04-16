import {MinterTxDataSell, TX_TYPE_SELL, formatCoin} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';

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
    const txData = new MinterTxDataSell({
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
        txType: TX_TYPE_SELL,
        txData: txData.serialize(),
    };
}
