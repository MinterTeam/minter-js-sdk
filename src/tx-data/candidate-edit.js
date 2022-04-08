import {TxDataEditCandidate} from 'minterjs-tx';
// import TxDataEditCandidate from 'minterjs-tx/src/tx-data/edit-candidate.js';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {dataToAddress, dataToPublicKey, proxyNestedTxData, validateAddress, validatePublicKey} from '../utils.js';

/**
 * @param {object} txData
 * @param {string} txData.publicKey
 * @param {string} txData.rewardAddress
 * @param {string} txData.ownerAddress
 * @param {string} txData.controlAddress
 * @param {TxOptions} [options]
 * @constructor
 */
export default function EditCandidateTxData({publicKey, rewardAddress, ownerAddress, controlAddress}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
        validateAddress(rewardAddress, 'rewardAddress');
        validateAddress(ownerAddress, 'ownerAddress');
        validateAddress(controlAddress, 'controlAddress');
    }

    this.publicKey = publicKey;
    this.rewardAddress = rewardAddress;
    this.ownerAddress = ownerAddress;
    this.controlAddress = controlAddress;

    this.txData = new TxDataEditCandidate({
        publicKey: toBuffer(publicKey),
        rewardAddress: toBuffer(rewardAddress),
        ownerAddress: toBuffer(ownerAddress),
        controlAddress: toBuffer(controlAddress),
    });

    proxyNestedTxData(this);
}

/**
 * @param {object} txData
 * @param {Buffer|string} txData.publicKey
 * @param {Buffer|string} txData.rewardAddress
 * @param {Buffer|string} txData.ownerAddress
 * @param {Buffer|string} txData.controlAddress
 * @param {TxOptions} [options]
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromBufferFields = function fromBufferFields({publicKey, rewardAddress, ownerAddress, controlAddress}, options = {}) {
    return new EditCandidateTxData({
        publicKey: dataToPublicKey(publicKey),
        rewardAddress: dataToAddress(rewardAddress),
        ownerAddress: dataToAddress(ownerAddress),
        controlAddress: dataToAddress(controlAddress),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromRlp = function fromRlp(data) {
    return EditCandidateTxData.fromBufferFields(new TxDataEditCandidate(data));
};
