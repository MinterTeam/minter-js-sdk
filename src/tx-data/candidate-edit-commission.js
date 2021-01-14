import {TxDataEditCandidateCommission} from 'minterjs-tx';
import {publicToString, toBuffer} from 'minterjs-util';
import {bufferToInteger, integerToHexString, proxyNestedTxData, validatePublicKey, validateUint} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {number|string} commission
 * @constructor
 */
export default function EditCandidateCommissionTxData({publicKey, commission}) {
    validatePublicKey(publicKey, 'publicKey');
    validateUint(commission, 'commission');

    this.publicKey = publicKey;
    this.commission = commission;

    this.txData = new TxDataEditCandidateCommission({
        publicKey: toBuffer(publicKey),
        commission: integerToHexString(commission),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} commission
 * @return {EditCandidateCommissionTxData}
 */
EditCandidateCommissionTxData.fromBufferFields = function fromBufferFields({publicKey, commission}) {
    return new EditCandidateCommissionTxData({
        publicKey: publicToString(publicKey),
        commission: bufferToInteger(toBuffer(commission)),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidateCommissionTxData}
 */
EditCandidateCommissionTxData.fromRlp = function fromRlp(data) {
    return EditCandidateCommissionTxData.fromBufferFields(new TxDataEditCandidateCommission(data));
};
