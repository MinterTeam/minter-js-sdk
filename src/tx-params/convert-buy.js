import {MinterTxDataBuy, TX_TYPE_BUY, coinToBuffer} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';

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
    const txData = new MinterTxDataBuy({
        coinToSell: coinToBuffer(coinFrom),
        coinToBuy: coinToBuffer(coinTo),
        valueToBuy: `0x${convertToPip(buyAmount, 'hex')}`,
        maximumValueToSell: `0x${convertToPip(maxSellAmount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_BUY,
        txData: txData.serialize(),
    };
}
