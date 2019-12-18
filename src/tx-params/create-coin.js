import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
import CreateCoinTxData from '../tx-data/create-coin';

/**
 * @constructor
 * @param {string} coinName
 * @param {string} coinSymbol
 * @param {number|string} initialAmount
 * @param {number|string} initialReserve
 * @param {number|string} crr
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function CreateCoinTxParams({coinName, coinSymbol, initialAmount, initialReserve, crr, feeCoinSymbol, ...otherParams}) {
    const txData = new CreateCoinTxData({
        name: coinName,
        symbol: coinSymbol,
        initialAmount,
        initialReserve,
        constantReserveRatio: crr,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.CREATE_COIN,
        txData: txData.serialize(),
    };
}
