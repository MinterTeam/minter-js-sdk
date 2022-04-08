import {TxDataRemoveLiquidity} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {object} txData
 * @param {number|string} txData.coin0 - coin id
 * @param {number|string} txData.coin1 - coin id
 * @param {number|string} txData.liquidity - volume of shares to be withdrawn from the pool
 * @param {number|string} [txData.minimumVolume0]
 * @param {number|string} [txData.minimumVolume1]
 * @param {TxOptions} [options]
 * @constructor
 */
export default function RemoveLiquidityTxData({coin0, coin1, liquidity, minimumVolume0 = 0, minimumVolume1 = 0}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coin0, 'coin0');
        validateUint(coin1, 'coin1');
        validateAmount(liquidity, 'liquidity');
        validateAmount(minimumVolume0, 'minimumVolume0');
        validateAmount(minimumVolume1, 'minimumVolume1');
    }

    this.coin0 = coin0;
    this.coin1 = coin1;
    this.liquidity = liquidity;
    this.minimumVolume0 = minimumVolume0;
    this.minimumVolume1 = minimumVolume1;

    this.txData = new TxDataRemoveLiquidity({
        coin0: integerToHexString(coin0),
        coin1: integerToHexString(coin1),
        liquidity: `0x${convertToPip(liquidity, 'hex')}`,
        minimumVolume0: `0x${convertToPip(minimumVolume0, 'hex')}`,
        minimumVolume1: `0x${convertToPip(minimumVolume1, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.coin0
 * @param {Buffer|string} txData.coin1
 * @param {Buffer|string} txData.liquidity
 * @param {Buffer|string} txData.minimumVolume0
 * @param {Buffer|string} txData.minimumVolume1
 * @param {TxOptions} [options]
 * @return {RemoveLiquidityTxData}
 */
RemoveLiquidityTxData.fromBufferFields = function fromBufferFields({coin0, minimumVolume0, coin1, liquidity, minimumVolume1}, options = {}) {
    return new RemoveLiquidityTxData({
        coin0: dataToInteger(coin0),
        coin1: dataToInteger(coin1),
        liquidity: dataPipToAmount(liquidity),
        minimumVolume0: dataPipToAmount(minimumVolume0),
        minimumVolume1: dataPipToAmount(minimumVolume1),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {RemoveLiquidityTxData}
 */
RemoveLiquidityTxData.fromRlp = function fromRlp(data) {
    return RemoveLiquidityTxData.fromBufferFields(new TxDataRemoveLiquidity(data));
};
