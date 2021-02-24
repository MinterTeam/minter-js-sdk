import {TxDataRecreateToken} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer, coinToBuffer, bufferToCoin, COIN_MAX_MAX_SUPPLY} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, validateAmount, validateTicker, validateMaxSupply, validateBoolean, bufferToBoolean} from '../utils.js';

/**
 * @param {string} [name]
 * @param {string} symbol
 * @param {number|string} initialAmount
 * @param {number|string} [maxSupply]
 * @param {boolean} mintable
 * @param {boolean} burnable
 * @constructor
 */
export default function RecreateTokenTxData({name = '', symbol, initialAmount, maxSupply = COIN_MAX_MAX_SUPPLY, mintable, burnable}) {
    validateTicker(symbol, 'symbol');
    validateAmount(initialAmount, 'initialAmount');
    validateMaxSupply(maxSupply, initialAmount);
    validateBoolean(mintable, 'mintable');
    validateBoolean(burnable, 'burnable');

    this.name = name;
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.maxSupply = maxSupply;
    this.mintable = mintable;
    this.burnable = burnable;

    this.txData = new TxDataRecreateToken({
        name: Buffer.from(name.toString(), 'utf-8'),
        symbol: coinToBuffer(symbol),
        initialAmount: `0x${convertToPip(initialAmount, 'hex')}`,
        maxSupply: `0x${convertToPip(maxSupply, 'hex')}`,
        mintable: mintable ? '0x01' : '0x00',
        burnable: burnable ? '0x01' : '0x00',
    });

    proxyNestedTxData(this);
}

/**
 *
 * @param {Buffer|string} name
 * @param {Buffer|string} symbol
 * @param {Buffer|string|number} initialAmount
 * @param {Buffer|string|number} maxSupply
 * @param {Buffer|string} mintable
 * @param {Buffer|string} burnable
 * @return {RecreateTokenTxData}
 */
RecreateTokenTxData.fromBufferFields = function fromBufferFields({name, symbol, initialAmount, maxSupply, mintable, burnable}) {
    return new RecreateTokenTxData({
        name: toBuffer(name).toString('utf-8'),
        symbol: bufferToCoin(toBuffer(symbol)),
        initialAmount: convertFromPip(bufferToInteger(toBuffer(initialAmount))),
        maxSupply: convertFromPip(bufferToInteger(toBuffer(maxSupply))),
        mintable: bufferToBoolean(toBuffer(mintable)),
        burnable: bufferToBoolean(toBuffer(burnable)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {RecreateTokenTxData}
 */
RecreateTokenTxData.fromRlp = function fromRlp(data) {
    return RecreateTokenTxData.fromBufferFields(new TxDataRecreateToken(data));
};
