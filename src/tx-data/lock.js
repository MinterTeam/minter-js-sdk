import {TxDataLock} from 'minterjs-tx';
import {convertToPip, convertFromPip, toBuffer} from 'minterjs-util';
// import {convertToPip} from 'minterjs-util/src/converter.js';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {bufferToInteger, integerToHexString, proxyNestedTxData, validateUint, validateAmount} from '../utils.js';


/**
 * @param {number|string} dueBlock
 * @param {number|string} value
 * @param {number|string} coin - coin id
 * @constructor
 */
export default function LockTxData({dueBlock = 0, value = 0, coin}) {
    validateUint(dueBlock, 'dueBlock');
    validateUint(coin, 'coin');
    validateAmount(value, 'value');

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
 * @return {LockTxData}
 */
LockTxData.fromBufferFields = function fromBufferFields({dueBlock, value, coin}) {
    return new LockTxData({
        dueBlock: bufferToInteger(toBuffer(dueBlock)),
        coin: bufferToInteger(toBuffer(coin)),
        value: convertFromPip(bufferToInteger(toBuffer(value))),
    });
};

/**
 * @param {Buffer|string} data
 * @return {LockTxData}
 */
LockTxData.fromRlp = function fromRlp(data) {
    return LockTxData.fromBufferFields(new TxDataLock(data));
};
