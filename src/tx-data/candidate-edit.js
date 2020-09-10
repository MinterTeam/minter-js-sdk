import {TxDataEditCandidate} from 'minterjs-tx';
// import TxDataEditCandidate from 'minterjs-tx/src/tx-data/edit-candidate.js';
import {addressToString, publicToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {addTxDataFields, validateAddress, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {string} [newPublicKey]
 * @param {string} rewardAddress
 * @param {string} ownerAddress
 * @param {string} controlAddress
 * @constructor
 */
export default function EditCandidateTxData({publicKey, newPublicKey, rewardAddress, ownerAddress, controlAddress}) {
    validatePublicKey(publicKey, 'publicKey');
    validatePublicKey(newPublicKey, 'newPublicKey');
    validateAddress(rewardAddress, 'rewardAddress');
    validateAddress(ownerAddress, 'ownerAddress');
    validateAddress(controlAddress, 'controlAddress');

    this.publicKey = publicKey;
    this.newPublicKey = newPublicKey;
    this.rewardAddress = rewardAddress;
    this.ownerAddress = ownerAddress;
    this.controlAddress = controlAddress;

    this.txData = new TxDataEditCandidate({
        publicKey: toBuffer(publicKey),
        newPublicKey: toBuffer(newPublicKey),
        rewardAddress: toBuffer(rewardAddress),
        ownerAddress: toBuffer(ownerAddress),
        controlAddress: toBuffer(controlAddress),
    });

    addTxDataFields(this);

    // proxy TxDataEditCandidate
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} newPublicKey
 * @param {Buffer|string} rewardAddress
 * @param {Buffer|string} ownerAddress
 * @param {Buffer|string} controlAddress
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromBufferFields = function fromBufferFields({publicKey, newPublicKey, rewardAddress, ownerAddress, controlAddress}) {
    return new EditCandidateTxData({
        publicKey: publicToString(publicKey),
        newPublicKey: publicToString(newPublicKey),
        rewardAddress: addressToString(rewardAddress),
        ownerAddress: addressToString(ownerAddress),
        controlAddress: addressToString(controlAddress),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromRlp = function fromRlp(data) {
    return EditCandidateTxData.fromBufferFields(new TxDataEditCandidate(data));
};
