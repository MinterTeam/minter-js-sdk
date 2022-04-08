import {TxDataCreateCoin} from 'minterjs-tx';
// import TxDataCreateCoin from 'minterjs-tx/src/tx-data/create-coin.js';
// import {coinToBuffer} from 'minterjs-tx/src/helpers.js';
import {convertToPip, toBuffer, coinToBuffer, bufferToCoin, COIN_MAX_MAX_SUPPLY} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateTicker, validateMaxSupply} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} [txData.name]
 * @param {string} txData.symbol
 * @param {number|string} txData.initialAmount
 * @param {number|string} txData.initialReserve
 * @param {number|string} txData.constantReserveRatio
 * @param {number|string} [txData.maxSupply]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function CreateCoinTxData({name = '', symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply = COIN_MAX_MAX_SUPPLY}, options = {}) {
    if (!options.disableValidation) {
        validateTicker(symbol, 'symbol');
        validateAmount(initialAmount, 'initialAmount');
        validateAmount(initialReserve, 'initialReserve');
        validateMaxSupply(maxSupply, initialAmount);
    }

    this.name = name;
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.initialReserve = initialReserve;
    this.constantReserveRatio = constantReserveRatio;
    this.maxSupply = maxSupply;

    this.txData = new TxDataCreateCoin({
        name: Buffer.from(name.toString(), 'utf8'),
        symbol: coinToBuffer(symbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: integerToHexString(constantReserveRatio),
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
    }, {forceDefaultValues: true});

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.name
 * @param {Buffer|string} txData.symbol
 * @param {Buffer|string|number} txData.initialAmount
 * @param {Buffer|string|number} txData.initialReserve
 * @param {Buffer|string|number} txData.constantReserveRatio
 * @param {number|string|number} txData.maxSupply
 * @param {TxOptions} [options]
 * @return {CreateCoinTxData}
 */
CreateCoinTxData.fromBufferFields = function fromBufferFields({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply}, options = {}) {
    return new CreateCoinTxData({
        name: toBuffer(name).toString('utf8'),
        symbol: bufferToCoin(toBuffer(symbol)),
        initialAmount: dataPipToAmount(initialAmount),
        initialReserve: dataPipToAmount(initialReserve),
        constantReserveRatio: dataToInteger(constantReserveRatio),
        maxSupply: dataPipToAmount(maxSupply),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {CreateCoinTxData}
 */
CreateCoinTxData.fromRlp = function fromRlp(data) {
    return CreateCoinTxData.fromBufferFields(new TxDataCreateCoin(data));
};
