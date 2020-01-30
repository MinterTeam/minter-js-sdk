import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import DeclareCandidacyTxData from '../tx-data/candidacy-declare.js';

/**
 * @constructor
 * @param {string} address
 * @param {string} publicKey
 * @param {number|string} commission
 * @param {string} coinSymbol
 * @param {number|string} stake
 * @param {string} feeCoinSymbol
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function DeclareCandidacyTxParams({address, publicKey, commission, coinSymbol, stake, feeCoinSymbol, ...otherParams}) {
    const txData = new DeclareCandidacyTxData({
        address,
        publicKey,
        commission,
        coin: coinSymbol,
        stake,
    });

    if (!feeCoinSymbol) {
        feeCoinSymbol = coinSymbol;
    }

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.DECLARE_CANDIDACY,
        txData: txData.serialize(),
    };
}
