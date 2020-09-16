import {TxDataEditCandidatePublicKey} from 'minterjs-tx';
import {publicToString, toBuffer} from 'minterjs-util';
import {addTxDataFields, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {string} newPublicKey
 * @constructor
 */
export default function EditCandidatePublicKeyTxData({publicKey, newPublicKey}) {
    validatePublicKey(publicKey, 'publicKey');
    validatePublicKey(newPublicKey, 'newPublicKey');

    this.publicKey = publicKey;
    this.newPublicKey = newPublicKey;

    this.txData = new TxDataEditCandidatePublicKey({
        publicKey: toBuffer(publicKey),
        newPublicKey: toBuffer(newPublicKey),
    });

    addTxDataFields(this);

    // proxy TxDataEditCandidate
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} newPublicKey
 * @return {EditCandidatePublicKeyTxData}
 */
EditCandidatePublicKeyTxData.fromBufferFields = function fromBufferFields({publicKey, newPublicKey}) {
    return new EditCandidatePublicKeyTxData({
        publicKey: publicToString(publicKey),
        newPublicKey: publicToString(newPublicKey),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidatePublicKeyTxData}
 */
EditCandidatePublicKeyTxData.fromRlp = function fromRlp(data) {
    return EditCandidatePublicKeyTxData.fromBufferFields(new TxDataEditCandidatePublicKey(data));
};
