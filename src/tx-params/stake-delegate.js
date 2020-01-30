import {TX_TYPE} from 'minterjs-tx';
import DelegateTxData from '../tx-data/stake-delegate.js';

/**
 * @constructor
 * @param {string} publicKey
 * @param {string} coinSymbol
 * @param {number|string} stake
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function DelegateTxParams({publicKey, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
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
