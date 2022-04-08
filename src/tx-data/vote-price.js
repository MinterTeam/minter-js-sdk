import {TxDataPriceVote} from 'minterjs-tx';
import {dataToInteger, integerToHexString, proxyNestedTxData, validateUint} from '../utils.js';


/**
 * @param {object} txTata
 * @param {number|string} txTata.price
 * @param {TxOptions} [options]
 * @constructor
 */
export default function PriceVoteTxData({price}, options = {}) {
    if (!options.disableValidation) {
        validateUint(price, 'price');
    }

    this.price = price;

    this.txData = new TxDataPriceVote({
        price: integerToHexString(price),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string|number} price
 * @param {TxOptions} [options]
 * @return {PriceVoteTxData}
 */
PriceVoteTxData.fromBufferFields = function fromBufferFields({price}, options = {}) {
    return new PriceVoteTxData({
        price: dataToInteger(price),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {PriceVoteTxData}
 */
PriceVoteTxData.fromRlp = function fromRlp(data) {
    return PriceVoteTxData.fromBufferFields(new TxDataPriceVote(data));
};
