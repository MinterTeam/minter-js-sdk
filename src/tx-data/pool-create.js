import {TxDataCreateSwapPool} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
import {proxyNestedTxData, dataToInteger, dataPipToAmount, integerToHexString, validateAmount, validateUint} from '../utils.js';

/**
 * @param {number|string} coin0 - coin id
 * @param {number|string} coin1 - coin id
 * @param {number|string} volume0
 * @param {number|string} volume1
 * @param {TxOptions} [options]
 * @constructor
 */
export default function CreatePoolTxData({coin0, coin1, volume0, volume1}, options = {}) {
    if (!options.disableValidation) {
        validateUint(coin0, 'coin0');
        validateUint(coin1, 'coin1');
        validateAmount(volume0, 'volume0');
        validateAmount(volume1, 'volume1');
    }

    // swap values to sort by id ascending (make tx hash independent of coin order)
    if (Number(coin0) > Number(coin1)) {
        [coin0, coin1] = [coin1, coin0];
        [volume0, volume1] = [volume1, volume0];
    }

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
 * @param {TxOptions} [options]
 * @return {CreatePoolTxData}
 */
CreatePoolTxData.fromBufferFields = function fromBufferFields({coin0, volume0, coin1, volume1}, options = {}) {
    return new CreatePoolTxData({
        coin0: dataToInteger(coin0),
        coin1: dataToInteger(coin1),
        volume0: dataPipToAmount(volume0),
        volume1: dataPipToAmount(volume1),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {CreatePoolTxData}
 */
CreatePoolTxData.fromRlp = function fromRlp(data) {
    return CreatePoolTxData.fromBufferFields(new TxDataCreateSwapPool(data));
};
