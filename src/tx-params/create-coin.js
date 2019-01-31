import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import {formatCoin} from 'minterjs-tx/src/helpers';
import {padToEven} from 'ethjs-util';
import {convertToPip} from 'minterjs-util/src/converter';
import {TX_TYPE_CREATE_COIN} from 'minterjs-tx/src/tx-types';

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
    const txData = new MinterCreateCoinTxData({
        name: coinName,
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${padToEven(convertToPip(initialAmount, 'hex'))}`,
        initialReserve: `0x${padToEven(convertToPip(initialReserve, 'hex'))}`,
        constantReserveRatio: `0x${padToEven(Number(crr).toString(16))}`,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_CREATE_COIN,
        txData: txData.serialize(),
    };
}
