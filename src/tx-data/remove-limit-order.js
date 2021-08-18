import {TxDataRemoveLimitOrder} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {bufferToInteger, integerToHexString, proxyNestedTxData, validateUint} from '../utils.js';


/**
 *
 * @param {number|string} id
 * @constructor
 */
export default function RemoveLimitOrderTxData({id}) {
    validateUint(id, 'height');

    this.id = id;

    this.txData = new TxDataRemoveLimitOrder({
        id: integerToHexString(id),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string|number} id
 * @return {RemoveLimitOrderTxData}
 */
RemoveLimitOrderTxData.fromBufferFields = function fromBufferFields({id}) {
    return new RemoveLimitOrderTxData({
        id: bufferToInteger(toBuffer(id)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {RemoveLimitOrderTxData}
 */
RemoveLimitOrderTxData.fromRlp = function fromRlp(data) {
    return RemoveLimitOrderTxData.fromBufferFields(new TxDataRemoveLimitOrder(data));
};
