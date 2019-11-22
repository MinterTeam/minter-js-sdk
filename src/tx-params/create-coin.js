import {TxDataCreateCoin, TX_TYPE, coinToBuffer} from 'minterjs-tx';
// import TxDataCreateCoin from 'minterjs-tx/src/tx-data/create-coin';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
import {integerToHexString} from '../utils';

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
    const txData = new TxDataCreateCoin({
        name: Buffer.from(coinName.toString(), 'utf-8'),
        symbol: coinToBuffer(coinSymbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: `0x${integerToHexString(crr)}`,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.CREATE_COIN,
        txData: txData.serialize(),
    };
}
