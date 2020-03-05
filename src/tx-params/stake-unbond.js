import {TX_TYPE} from 'minterjs-tx';
import UnbondTxData from '../tx-data/stake-unbond.js';

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
export default function UnbondTxParams({publicKey, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
    // eslint-disable-next-line no-console
    console.warn('UnbondTxParams is deprecated');

    const txData = new UnbondTxData({
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
        txType: TX_TYPE.UNBOND,
        txData: txData.serialize(),
    };
}
