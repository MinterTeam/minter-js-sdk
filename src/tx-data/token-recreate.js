import {TxDataRecreateToken} from 'minterjs-tx';
import {convertToPip, toBuffer, coinToBuffer, bufferToCoin, COIN_MAX_MAX_SUPPLY} from 'minterjs-util';
import {proxyNestedTxData, dataPipToAmount, validateAmount, validateTicker, validateMaxSupply, validateBoolean, bufferToBoolean} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} [txData.name]
 * @param {string} txData.symbol
 * @param {number|string} txData.initialAmount
 * @param {number|string} [txData.maxSupply]
 * @param {boolean} txData.mintable
 * @param {boolean} txData.burnable
 * @param {TxOptions} [options]
 * @constructor
 */
export default function RecreateTokenTxData({name = '', symbol, initialAmount, maxSupply = COIN_MAX_MAX_SUPPLY, mintable, burnable}, options = {}) {
    if (!options.disableValidation) {
        validateTicker(symbol, 'symbol');
        validateAmount(initialAmount, 'initialAmount');
        validateMaxSupply(maxSupply, initialAmount);
        validateBoolean(mintable, 'mintable');
        validateBoolean(burnable, 'burnable');
    }

    this.name = name;
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.maxSupply = maxSupply;
    this.mintable = mintable;
    this.burnable = burnable;

    this.txData = new TxDataRecreateToken({
        name: Buffer.from(name.toString(), 'utf8'),
        symbol: coinToBuffer(symbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
        mintable: mintable ? '0x01' : '0x00',
        burnable: burnable ? '0x01' : '0x00',
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.name
 * @param {Buffer|string} txData.symbol
 * @param {Buffer|string|number} txData.initialAmount
 * @param {Buffer|string|number} txData.maxSupply
 * @param {Buffer|string} txData.mintable
 * @param {Buffer|string} txData.burnable
 * @param {TxOptions} [options]
 * @return {RecreateTokenTxData}
 */
RecreateTokenTxData.fromBufferFields = function fromBufferFields({name, symbol, initialAmount, maxSupply, mintable, burnable}, options = {}) {
    return new RecreateTokenTxData({
        name: toBuffer(name).toString('utf8'),
        symbol: bufferToCoin(toBuffer(symbol)),
        initialAmount: dataPipToAmount(initialAmount),
        maxSupply: dataPipToAmount(maxSupply),
        mintable: bufferToBoolean(toBuffer(mintable)),
        burnable: bufferToBoolean(toBuffer(burnable)),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {RecreateTokenTxData}
 */
RecreateTokenTxData.fromRlp = function fromRlp(data) {
    return RecreateTokenTxData.fromBufferFields(new TxDataRecreateToken(data));
};
