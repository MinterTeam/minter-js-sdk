import {TxDataRecreateCoin} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer, coinToBuffer, bufferToCoin, COIN_MAX_MAX_SUPPLY, COIN_MIN_MAX_SUPPLY} from 'minterjs-util';
import {addTxDataFields, bufferToInteger, integerToHexString, validateAmount, validateCoin} from '../utils.js';

/**
 * @param {string} name
 * @param {string} symbol
 * @param {number|string} initialAmount
 * @param {number|string} initialReserve
 * @param {number|string} constantReserveRatio
 * @param {number|string} [maxSupply]
 * @constructor
 */
export default function RecreateCoinTxData({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply = COIN_MAX_MAX_SUPPLY}) {
    validateCoin(symbol, 'symbol');
    validateAmount(initialAmount, 'initialAmount');
    validateAmount(initialReserve, 'initialReserve');
    validateAmount(maxSupply, 'maxSupply');
    if (maxSupply > COIN_MAX_MAX_SUPPLY || maxSupply < COIN_MIN_MAX_SUPPLY) {
        throw new Error(`Field \`maxSupply\` should be between ${COIN_MIN_MAX_SUPPLY} and ${COIN_MAX_MAX_SUPPLY}`);
    }
    if (Number(initialAmount) > Number(maxSupply)) {
        throw new Error('Field `initialAmount` should be less or equal of maxSupply');
    }

    this.name = name;
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.initialReserve = initialReserve;
    this.constantReserveRatio = constantReserveRatio;
    this.maxSupply = maxSupply;

    this.txData = new TxDataRecreateCoin({
        name: Buffer.from(name.toString(), 'utf-8'),
        symbol: coinToBuffer(symbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        initialReserve: `0x${convertToPip(initialReserve, 'hex')}`,
        constantReserveRatio: integerToHexString(constantReserveRatio),
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
    });

    addTxDataFields(this);

    // proxy TxData
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
 * @return {RecreateCoinTxData}
 */
RecreateCoinTxData.fromBufferFields = function fromBufferFields({name, symbol, initialAmount, initialReserve, constantReserveRatio, maxSupply}) {
    return new RecreateCoinTxData({
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
 * @return {RecreateCoinTxData}
 */
RecreateCoinTxData.fromRlp = function fromRlp(data) {
    return RecreateCoinTxData.fromBufferFields(new TxDataRecreateCoin(data));
};
