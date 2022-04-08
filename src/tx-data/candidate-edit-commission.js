import {TxDataEditCandidateCommission} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {dataToInteger, dataToPublicKey, integerToHexString, proxyNestedTxData, validatePublicKey, validateUint} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} txData.publicKey
 * @param {number|string} txData.commission
 * @param {TxOptions} [options]
 * @constructor
 */
export default function EditCandidateCommissionTxData({publicKey, commission}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateUint(commission, 'commission');
    }

    this.publicKey = publicKey;
    this.commission = commission;

    this.txData = new TxDataEditCandidateCommission({
        publicKey: toBuffer(publicKey),
        commission: integerToHexString(commission),
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.publicKey
 * @param {Buffer|string} txData.commission
 * @param {TxOptions} [options]
 * @return {EditCandidateCommissionTxData}
 */
EditCandidateCommissionTxData.fromBufferFields = function fromBufferFields({publicKey, commission}, options = {}) {
    return new EditCandidateCommissionTxData({
        publicKey: dataToPublicKey(publicKey),
        commission: dataToInteger(commission),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidateCommissionTxData}
 */
EditCandidateCommissionTxData.fromRlp = function fromRlp(data) {
    return EditCandidateCommissionTxData.fromBufferFields(new TxDataEditCandidateCommission(data));
};
