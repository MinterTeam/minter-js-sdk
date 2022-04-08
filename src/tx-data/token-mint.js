import {TxDataMintToken} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {dataToInteger, dataPipToAmount, integerToHexString, proxyNestedTxData, validateUint, validateAmount} from '../utils.js';


/**
 * @param {object} txData
 * @param {number|string} txData.value
 * @param {number|string} txData.coin - coin id
 * @param {TxOptions} [options]
 * @constructor
 */
export default function MintTokenTxData({value = 0, coin}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coin, 'coin');
        validateAmount(value, 'value');
    }

    this.value = value;
    this.coin = coin;

    this.txData = new TxDataMintToken({
        coin: integerToHexString(coin),
        value: `0x${convertToPip(value, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string|number} txData.value
 * @param {Buffer|string|number} txData.coin
 * @param {TxOptions} [options]
 * @return {MintTokenTxData}
 */
MintTokenTxData.fromBufferFields = function fromBufferFields({value, coin}, options = {}) {
    return new MintTokenTxData({
        coin: dataToInteger(coin),
        value: dataPipToAmount(value),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {MintTokenTxData}
 */
MintTokenTxData.fromRlp = function fromRlp(data) {
    return MintTokenTxData.fromBufferFields(new TxDataMintToken(data));
};
