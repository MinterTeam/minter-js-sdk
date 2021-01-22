import {TxDataAddLiquidity} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer, COIN_MAX_AMOUNT} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUint} from '../utils.js';
// import {convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @param {number|string} coin0 - coin id
 * @param {number|string} coin1 - coin id
 * @param {number|string} volume0
 * @param {number|string} [maximumVolume1]
 * @constructor
 */
export default function AddLiquidityTxData({coin0, coin1, volume0, maximumVolume1 = COIN_MAX_AMOUNT}) {
    validateUint(coin0, 'coin0');
    validateUint(coin1, 'coin1');
    validateAmount(volume0, 'volume0');
    validateAmount(maximumVolume1, 'maximumVolume1');

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
 * @return {AddLiquidityTxData}
 */
AddLiquidityTxData.fromBufferFields = function fromBufferFields({coin0, volume0, coin1, maximumVolume1}) {
    return new AddLiquidityTxData({
        coin0: bufferToInteger(toBuffer(coin0)),
        coin1: bufferToInteger(toBuffer(coin1)),
        volume0: convertFromPip(bufferToInteger(toBuffer(volume0))),
        maximumVolume1: convertFromPip(bufferToInteger(toBuffer(maximumVolume1))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {AddLiquidityTxData}
 */
AddLiquidityTxData.fromRlp = function fromRlp(data) {
    return AddLiquidityTxData.fromBufferFields(new TxDataAddLiquidity(data));
};
