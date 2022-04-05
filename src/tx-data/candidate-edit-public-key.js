import {TxDataEditCandidatePublicKey} from 'minterjs-tx';
import {toBuffer} from 'minterjs-util';
import {dataToPublicKey, proxyNestedTxData, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {string} newPublicKey
 * @param {TxOptions} [options]
 * @constructor
 */
export default function EditCandidatePublicKeyTxData({publicKey, newPublicKey}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validatePublicKey(newPublicKey, 'newPublicKey');
    }

    this.publicKey = publicKey;
    this.newPublicKey = newPublicKey;

    this.txData = new TxDataEditCandidatePublicKey({
        publicKey: toBuffer(publicKey),
        newPublicKey: toBuffer(newPublicKey),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} newPublicKey
 * @param {TxOptions} [options]
 * @return {EditCandidatePublicKeyTxData}
 */
EditCandidatePublicKeyTxData.fromBufferFields = function fromBufferFields({publicKey, newPublicKey}, options = {}) {
    return new EditCandidatePublicKeyTxData({
        publicKey: dataToPublicKey(publicKey),
        newPublicKey: dataToPublicKey(newPublicKey),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidatePublicKeyTxData}
 */
EditCandidatePublicKeyTxData.fromRlp = function fromRlp(data) {
    return EditCandidatePublicKeyTxData.fromBufferFields(new TxDataEditCandidatePublicKey(data));
};
