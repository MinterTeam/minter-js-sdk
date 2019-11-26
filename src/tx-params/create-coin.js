import {TxDataCreateCoin, TX_TYPE, coinToBuffer} from 'minterjs-tx';
// import TxDataCreateCoin from 'minterjs-tx/src/tx-data/create-coin';
// import {TX_TYPE} from 'minterjs-tx/src/tx-types';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
import {integerToHexString} from '../utils';

// limit in bips
export const MAX_MAX_SUPPLY = 10 ** 15;
export const MIN_MAX_SUPPLY = 1;

/**
 * @constructor
 * @param {string} coinName
 * @param {string} coinSymbol
 * @param {number|string} initialAmount
 * @param {number|string} initialReserve
 * @param {number|string} crr
 * @param {number|string} maxSupply
 * @param {string} [feeCoinSymbol]
 * @param {...TxParams} otherParams
 * @return {TxParams}
 */
export default function CreateCoinTxParams({coinName, coinSymbol, initialAmount, initialReserve, crr, maxSupply = MAX_MAX_SUPPLY, feeCoinSymbol, ...otherParams}) {
    if (maxSupply > MAX_MAX_SUPPLY || maxSupply < MIN_MAX_SUPPLY) {
        throw new Error(`maxSupply should be between ${MIN_MAX_SUPPLY} and ${MAX_MAX_SUPPLY}`);
    }

    if (initialAmount > maxSupply) {
        throw new Error('initialAmount should be less or equal of maxSupply');
    }

    const txData = new TxDataCreateCoin({
        name: Buffer.from(coinName.toString(), 'utf-8'),
        symbol: coinToBuffer(coinSymbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: `0x${integerToHexString(crr)}`,
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
    });

    return {
        ...otherParams,
        gasCoin: feeCoinSymbol,
        txType: TX_TYPE.CREATE_COIN,
        txData: txData.serialize(),
    };
}
