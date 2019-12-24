import {TxDataCreateCoin, coinToBuffer, bufferToCoin} from 'minterjs-tx';
// import TxDataCreateCoin from 'minterjs-tx/src/tx-data/create-coin';
// import {coinToBuffer} from 'minterjs-tx/src/helpers';
import {convertFromPip, convertToPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter';
import {bufferToInteger, integerToHexString} from '../utils';

// limit in bips
export const MAX_MAX_SUPPLY = 10 ** 15;
export const MIN_MAX_SUPPLY = 1;

/**
 * @param {string} name
 * @param {string} symbol
 * @param {number|string} initialAmount
 * @param {number|string} initialReserve
 * @param {number|string} constantReserveRatio
 * @param {number|string} [maxSupply]
 * @constructor
 */
export default function CreateCoinTxData({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply = MAX_MAX_SUPPLY}) {
    if (maxSupply > MAX_MAX_SUPPLY || maxSupply < MIN_MAX_SUPPLY) {
        throw new Error(`maxSupply should be between ${MIN_MAX_SUPPLY} and ${MAX_MAX_SUPPLY}`);
    }
    if (Number(initialAmount) > Number(maxSupply)) {
        throw new Error('initialAmount should be less or equal of maxSupply');
    }

    this.name = name;
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.initialReserve = initialReserve;
    this.constantReserveRatio = constantReserveRatio;

    this.txData = new TxDataCreateCoin({
        name: Buffer.from(name.toString(), 'utf-8'),
        symbol: coinToBuffer(symbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: `0x${integerToHexString(constantReserveRatio)}`,
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
    });

    // proxy TxDataSend
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 *
 * @param {Buffer|string} name
 * @param {Buffer|string} symbol
 * @param {Buffer|string|number} initialAmount
 * @param {Buffer|string|number} initialReserve
 * @param {Buffer|string|number} constantReserveRatio
 * @param {number|string|number} maxSupply
 * @return {CreateCoinTxData}
 */
CreateCoinTxData.fromBufferFields = function fromBufferFields({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply}) {
    return new CreateCoinTxData({
        name: toBuffer(name).toString('utf-8'),
        symbol: bufferToCoin(toBuffer(symbol)),
        initialAmount: convertFromPip(bufferToInteger(toBuffer(initialAmount))),
        initialReserve: convertFromPip(bufferToInteger(toBuffer(initialReserve))),
        constantReserveRatio: bufferToInteger(toBuffer(constantReserveRatio)),
        maxSupply: convertFromPip(bufferToInteger(toBuffer(maxSupply))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {CreateCoinTxData}
 */
CreateCoinTxData.fromRlp = function fromRlp(data) {
    return CreateCoinTxData.fromBufferFields(new TxDataCreateCoin(data));
};
