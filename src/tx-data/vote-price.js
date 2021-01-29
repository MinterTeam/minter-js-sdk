import {TxDataPriceVote} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {bufferToInteger, integerToHexString, proxyNestedTxData, validateUint} from '../utils.js';


/**
 *
 * @param {number|string} price
 * @constructor
 */
export default function PriceVoteTxData({price}) {
    validateUint(price, 'price');

    this.price = price;

    this.txData = new TxDataPriceVote({
        price: integerToHexString(price),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string|number} price
 * @return {PriceVoteTxData}
 */
PriceVoteTxData.fromBufferFields = function fromBufferFields({price}) {
    return new PriceVoteTxData({
        price: bufferToInteger(toBuffer(price)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {PriceVoteTxData}
 */
PriceVoteTxData.fromRlp = function fromRlp(data) {
    return PriceVoteTxData.fromBufferFields(new TxDataPriceVote(data));
};
