import {TxDataCreateCoin} from 'minterjs-tx';
// import TxDataCreateCoin from 'minterjs-tx/src/tx-data/create-coin.js';
// import {coinToBuffer} from 'minterjs-tx/src/helpers.js';
import {convertFromPip, convertToPip, toBuffer, coinToBuffer, bufferToCoin, COIN_MAX_MAX_SUPPLY, COIN_MIN_MAX_SUPPLY} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateCoin, validateMaxSupply} from '../utils.js';

/**
 * @param {string} name
 * @param {string} symbol
 * @param {number|string} initialAmount
 * @param {number|string} initialReserve
 * @param {number|string} constantReserveRatio
 * @param {number|string} [maxSupply]
 * @constructor
 */
export default function CreateCoinTxData({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply = COIN_MAX_MAX_SUPPLY}) {
    validateCoin(symbol, 'symbol');
    validateAmount(initialAmount, 'initialAmount');
    validateAmount(initialReserve, 'initialReserve');
    validateMaxSupply(maxSupply, initialAmount);

    this.name = name;
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.initialReserve = initialReserve;
    this.constantReserveRatio = constantReserveRatio;
    this.maxSupply = maxSupply;

    this.txData = new TxDataCreateCoin({
        name: Buffer.from(name.toString(), 'utf-8'),
        symbol: coinToBuffer(symbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: integerToHexString(constantReserveRatio),
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
    });

    proxyNestedTxData(this);
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
