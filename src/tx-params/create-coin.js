import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import {formatCoin} from 'minterjs-tx/src/helpers';
import ethUtil from 'ethereumjs-util';
import converter from 'minterjs-tx/src/converter';
import {TX_TYPE_CREATE_COIN} from 'minterjs-tx/src/tx-types';

/**
 * @constructor
 * @param {string} privateKey
 * @param {string} coinName
 * @param {string} coinSymbol
 * @param {number} initialAmount
 * @param {number} initialReserve
 * @param {number} crr
 * @param {string} [feeCoinSymbol]
 * @param {string} [message]
 * @return {TxParams}
 */
export default function CreateCoinTxParams({privateKey, coinName, coinSymbol, initialAmount, initialReserve, crr, feeCoinSymbol, message}) {
    const txData = new MinterCreateCoinTxData({
        name: coinName,
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${ethUtil.padToEven(converter.convert(initialAmount, 'pip').toString(16))}`,
        initialReserve: `0x${ethUtil.padToEven(converter.convert(initialReserve, 'pip').toString(16))}`,
        constantReserveRatio: `0x${ethUtil.padToEven(Number(crr).toString(16))}`,
    });

    return {
        privateKey,
        message,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_CREATE_COIN,
        txData: txData.serialize(),
    };
}
