import {TxDataAddLiquidity} from 'minterjs-tx';
import {convertToPip, COIN_MAX_AMOUNT} from 'minterjs-util';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {object} txData
 * @param {number|string} txData.coin0 - coin id
 * @param {number|string} txData.coin1 - coin id
 * @param {number|string} txData.volume0
 * @param {number|string} [txData.maximumVolume1]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function AddLiquidityTxData({coin0, coin1, volume0, maximumVolume1 = COIN_MAX_AMOUNT}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coin0, 'coin0');
        validateUint(coin1, 'coin1');
        validateAmount(volume0, 'volume0');
        validateAmount(maximumVolume1, 'maximumVolume1');
    }

    this.coin0 = coin0;
    this.coin1 = coin1;
    this.volume0 = volume0;
    this.maximumVolume1 = maximumVolume1;

    this.txData = new TxDataAddLiquidity({
        coin0: integerToHexString(coin0),
        coin1: integerToHexString(coin1),
        volume0: `0x${convertToPip(volume0, 'hex')}`,
        maximumVolume1: `0x${convertToPip(maximumVolume1, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.coin0
 * @param {Buffer|string} txData.volume0
 * @param {Buffer|string} txData.coin1
 * @param {Buffer|string} txData.maximumVolume1
 * @param {TxOptions} [options]
 * @return {AddLiquidityTxData}
 */
AddLiquidityTxData.fromBufferFields = function fromBufferFields({coin0, volume0, coin1, maximumVolume1}, options = {}) {
    return new AddLiquidityTxData({
        coin0: dataToInteger(coin0),
        coin1: dataToInteger(coin1),
        volume0: dataPipToAmount(volume0),
        maximumVolume1: dataPipToAmount(maximumVolume1),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {AddLiquidityTxData}
 */
AddLiquidityTxData.fromRlp = function fromRlp(data) {
    return AddLiquidityTxData.fromBufferFields(new TxDataAddLiquidity(data));
};
