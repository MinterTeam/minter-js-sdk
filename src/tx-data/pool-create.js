import {TxDataCreateSwapPool} from 'minterjs-tx';
import {convertFromPip, convertToPip, toBuffer} from 'minterjs-util';
import {proxyNestedTxData, bufferToInteger, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {number|string} coin0 - coin id
 * @param {number|string} coin1 - coin id
 * @param {number|string} volume0
 * @param {number|string} volume1
 * @constructor
 */
export default function CreateSwapPoolTxData({coin0, coin1, volume0, volume1}) {
    validateUint(coin0, 'coin0');
    validateUint(coin1, 'coin1');
    validateAmount(volume0, 'volume0');
    validateAmount(volume1, 'volume1');

    this.coin0 = coin0;
    this.coin1 = coin1;
    this.volume0 = volume0;
    this.volume1 = volume1;

    this.txData = new TxDataCreateSwapPool({
        coin0: integerToHexString(coin0),
        coin1: integerToHexString(coin1),
        volume0: `0x${convertToPip(volume0, 'hex')}`,
        volume1: `0x${convertToPip(volume1, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} coin0
 * @param {Buffer|string} volume0
 * @param {Buffer|string} coin1
 * @param {Buffer|string} volume1
 * @return {CreateSwapPoolTxData}
 */
CreateSwapPoolTxData.fromBufferFields = function fromBufferFields({coin0, volume0, coin1, volume1}) {
    return new CreateSwapPoolTxData({
        coin0: bufferToInteger(toBuffer(coin0)),
        coin1: bufferToInteger(toBuffer(coin1)),
        volume0: convertFromPip(bufferToInteger(toBuffer(volume0))),
        volume1: convertFromPip(bufferToInteger(toBuffer(volume1))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {CreateSwapPoolTxData}
 */
CreateSwapPoolTxData.fromRlp = function fromRlp(data) {
    return CreateSwapPoolTxData.fromBufferFields(new TxDataCreateSwapPool(data));
};
