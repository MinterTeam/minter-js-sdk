import {TxDataRemoveLimitOrder} from 'minterjs-tx';
import {dataToInteger, integerToHexString, proxyNestedTxData, validateUint} from '../utils.js';


/**
 * @param {number|string} id
 * @param {TxOptions} [options]
 * @constructor
 */
export default function RemoveLimitOrderTxData({id}, options = {}) {
    if (!options.disableValidation) {
        validateUint(id, 'height');
    }

    this.id = id;

    this.txData = new TxDataRemoveLimitOrder({
        id: integerToHexString(id),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string|number} id
 * @param {TxOptions} [options]
 * @return {RemoveLimitOrderTxData}
 */
RemoveLimitOrderTxData.fromBufferFields = function fromBufferFields({id}, options = {}) {
    return new RemoveLimitOrderTxData({
        id: dataToInteger(id),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {RemoveLimitOrderTxData}
 */
RemoveLimitOrderTxData.fromRlp = function fromRlp(data) {
    return RemoveLimitOrderTxData.fromBufferFields(new TxDataRemoveLimitOrder(data));
};
