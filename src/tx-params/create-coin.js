import {MinterTxDataCreateCoin, TX_TYPE_CREATE_COIN, formatCoin} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {Buffer} from 'safe-buffer';
import {toHexString} from '../utils';

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
    const txData = new MinterTxDataCreateCoin({
        name: Buffer.from(coinName.toString(), 'utf-8'),
        symbol: formatCoin(coinSymbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: `0x${toHexString(crr)}`,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE_CREATE_COIN,
        txData: txData.serialize(),
    };
}
