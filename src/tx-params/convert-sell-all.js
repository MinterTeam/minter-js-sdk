import {MinterTxDataSellAll, TX_TYPE_SELL_ALL, coinToBuffer} from 'minterjs-tx';
// import MinterTxDataSellAll from 'minterjs-tx/src/tx-data/sell-all';
// import {TX_TYPE_SELL_ALL} from 'minterjs-tx/src/tx-types';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';

/**
 * @constructor
 * @param {string} coinFrom
 * @param {string} coinTo
 * @param {number|string} [minBuyAmount=0]
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SellAllTxParams({coinFrom, coinTo, minBuyAmount = 0, feeCoinSymbol, ...otherParams}) {
    const txData = new MinterTxDataSellAll({
        coinToSell: coinToBuffer(coinFrom),
        coinToBuy: coinToBuffer(coinTo),
        minimumValueToBuy: `0x${convertToPip(minBuyAmount, 'hex')}`,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinFrom;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_SELL_ALL,
        txData: txData.serialize(),
    };
}
