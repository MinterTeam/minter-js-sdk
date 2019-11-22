import {TxDataSellAll, TX_TYPE, coinToBuffer} from 'minterjs-tx';
// import TxDataSellAll from 'minterjs-tx/src/tx-data/sell-all';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
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
    const txData = new TxDataSellAll({
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
        txType: TX_TYPE.SELL_ALL,
        txData: txData.serialize(),
    };
}
