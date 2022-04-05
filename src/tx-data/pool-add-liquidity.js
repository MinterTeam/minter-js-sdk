import {TxDataAddLiquidity} from 'minterjs-tx';
import {convertToPip, COIN_MAX_AMOUNT} from 'minterjs-util';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {number|string} coin0 - coin id
 * @param {number|string} coin1 - coin id
 * @param {number|string} volume0
 * @param {number|string} [maximumVolume1]
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
 * @param {Buffer|string} coin0
 * @param {Buffer|string} volume0
 * @param {Buffer|string} coin1
 * @param {Buffer|string} maximumVolume1
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
