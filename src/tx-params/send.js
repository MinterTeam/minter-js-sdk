import {TX_TYPE} from 'minterjs-tx';
import SendTxData from '../tx-data/send.js';

/**
 * @deprecated
 * @constructor
 * @param {string} address
 * @param {number|string} amount
 * @param {string} coinSymbol
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function SendTxParams({address, amount = 0, coinSymbol, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('SendTxParams is deprecated');

    const txData = new SendTxData({
        to: address,
        coin: coinSymbol,
        value: amount,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.SEND,
        txData: txData.serialize(),
    };
}
