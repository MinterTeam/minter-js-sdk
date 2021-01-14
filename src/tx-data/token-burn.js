import {TxDataBurnToken} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer} from 'minterjs-util';
import {bufferToInteger, integerToHexString, proxyNestedTxData, validateUint, validateAmount} from '../utils.js';


/**
 *
 * @param {number|string} value
 * @param {number|string} coin - coin id
 * @constructor
 */
export default function BurnTokenTxData({value = 0, coin}) {
    validateUint(coin, 'coin');
    validateAmount(value, 'value');

    this.value = value;
    this.coin = coin;

    this.txData = new TxDataBurnToken({
        coin: integerToHexString(coin),
        value: `0x${convertToPip(value, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string|number} value
 * @param {Buffer|string|number} coin
 * @return {BurnTokenTxData}
 */
BurnTokenTxData.fromBufferFields = function fromBufferFields({value, coin}) {
    return new BurnTokenTxData({
        coin: bufferToInteger(toBuffer(coin)),
        value: convertFromPip(bufferToInteger(toBuffer(value))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {BurnTokenTxData}
 */
BurnTokenTxData.fromRlp = function fromRlp(data) {
    return BurnTokenTxData.fromBufferFields(new TxDataBurnToken(data));
};
