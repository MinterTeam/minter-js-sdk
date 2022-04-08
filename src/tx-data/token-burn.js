import {TxDataBurnToken} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {dataToInteger, dataPipToAmount, integerToHexString, proxyNestedTxData, validateUint, validateAmount} from '../utils.js';


/**
 * @param {object} txData
 * @param {number|string} txData.value
 * @param {number|string} txData.coin - coin id
 * @param {TxOptions} [options]
 * @constructor
 */
export default function BurnTokenTxData({value = 0, coin}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coin, 'coin');
        validateAmount(value, 'value');
    }

    this.value = value;
    this.coin = coin;

    this.txData = new TxDataBurnToken({
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
 * @return {BurnTokenTxData}
 */
BurnTokenTxData.fromBufferFields = function fromBufferFields({value, coin}, options = {}) {
    return new BurnTokenTxData({
        coin: dataToInteger(coin),
        value: dataPipToAmount(value),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {BurnTokenTxData}
 */
BurnTokenTxData.fromRlp = function fromRlp(data) {
    return BurnTokenTxData.fromBufferFields(new TxDataBurnToken(data));
};
