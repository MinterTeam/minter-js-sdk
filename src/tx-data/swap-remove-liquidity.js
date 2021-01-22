import {TxDataRemoveLiquidity} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUint} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {number|string} coin0 - coin id
 * @param {number|string} coin1 - coin id
 * @param {number|string} liquidity - volume of shares to be withdrawn from the pool
 * @param {number|string} [minimumVolume0]
 * @param {number|string} [minimumVolume1]
 * @constructor
 */
export default function RemoveLiquidityTxData({coin0, coin1, liquidity, minimumVolume0 = 0, minimumVolume1 = 0}) {
    validateUint(coin0, 'coin0');
    validateUint(coin1, 'coin1');
    validateAmount(liquidity, 'liquidity');
    validateAmount(minimumVolume0, 'minimumVolume0');
    validateAmount(minimumVolume1, 'minimumVolume1');

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
 * @param {Buffer|string} coin0
 * @param {Buffer|string} coin1
 * @param {Buffer|string} liquidity
 * @param {Buffer|string} minimumVolume0
 * @param {Buffer|string} minimumVolume1
 * @return {RemoveLiquidityTxData}
 */
RemoveLiquidityTxData.fromBufferFields = function fromBufferFields({coin0, minimumVolume0, coin1, liquidity, minimumVolume1}) {
    return new RemoveLiquidityTxData({
        coin0: bufferToInteger(toBuffer(coin0)),
        coin1: bufferToInteger(toBuffer(coin1)),
        liquidity: convertFromPip(bufferToInteger(toBuffer(liquidity))),
        minimumVolume0: convertFromPip(bufferToInteger(toBuffer(minimumVolume0))),
        minimumVolume1: convertFromPip(bufferToInteger(toBuffer(minimumVolume1))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {RemoveLiquidityTxData}
 */
RemoveLiquidityTxData.fromRlp = function fromRlp(data) {
    return RemoveLiquidityTxData.fromBufferFields(new TxDataRemoveLiquidity(data));
};
