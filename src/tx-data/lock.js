import {TxDataLock} from 'minterjs-tx';
import {convertToPip} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
import {dataToInteger, dataPipToAmount, integerToHexString, proxyNestedTxData, validateUint, validateAmount} from '../utils.js';


/**
 * @param {number|string} dueBlock
 * @param {number|string} value
 * @param {number|string} coin - coin id
 * @param {TxOptions} [options]
 * @constructor
 */
export default function LockTxData({dueBlock = 0, value = 0, coin}, options = {}) {
    if (!options.disableValidation) {
        validateUint(dueBlock, 'dueBlock');
        validateUint(coin, 'coin');
        validateAmount(value, 'value');
    }

    this.dueBlock = dueBlock;
    this.value = value;
    this.coin = coin;

    this.txData = new TxDataLock({
        dueBlock: integerToHexString(dueBlock),
        coin: integerToHexString(coin),
        value: `0x${convertToPip(value, 'hex')}`,
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string|number} dueBlock
 * @param {Buffer|string|number} value
 * @param {Buffer|string|number} coin
 * @param {TxOptions} [options]
 * @return {LockTxData}
 */
LockTxData.fromBufferFields = function fromBufferFields({dueBlock, value, coin}, options = {}) {
    return new LockTxData({
        dueBlock: dataToInteger(dueBlock),
        coin: dataToInteger(coin),
        value: dataPipToAmount(value),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {LockTxData}
 */
LockTxData.fromRlp = function fromRlp(data) {
    return LockTxData.fromBufferFields(new TxDataLock(data));
};
