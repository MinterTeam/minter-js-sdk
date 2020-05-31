import {TX_TYPE} from 'minterjs-util';
import DelegateTxData from '../tx-data/stake-delegate.js';

/**
 * @deprecated
 * @constructor
 * @param {string} publicKey
 * @param {string} coinSymbol
 * @param {number|string} stake
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function DelegateTxParams({publicKey, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('DelegateTxParams is deprecated');

    const txData = new DelegateTxData({
        publicKey,
        coin: coinSymbol,
        stake,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.DELEGATE,
        txData: txData.serialize(),
    };
}
