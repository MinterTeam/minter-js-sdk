import {TX_TYPE} from 'minterjs-tx';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types.js';
import CreateCoinTxData from '../tx-data/create-coin.js';

/**
 * @constructor
 * @param {string} name
 * @param {string} symbol
 * @param {number|string} initialAmount
 * @param {number|string} initialReserve
 * @param {number|string} constantReserveRatio
 * @param {number|string} [maxSupply]
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function CreateCoinTxParams({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply, feeCoinSymbol, ...otherParams}) {
    const txData = new CreateCoinTxData({
        name,
        symbol,
        initialAmount,
        initialReserve,
        constantReserveRatio,
        maxSupply,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.CREATE_COIN,
        txData: txData.serialize(),
    };
}
