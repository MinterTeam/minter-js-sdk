import {TxDataEditCandidate} from 'minterjs-tx';
// import TxDataEditCandidate from 'minterjs-tx/src/tx-data/edit-candidate.js';
import {addressToString, publicToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {proxyNestedTxData, validateAddress, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {string} rewardAddress
 * @param {string} ownerAddress
 * @param {string} controlAddress
 * @constructor
 */
export default function EditCandidateTxData({publicKey, rewardAddress, ownerAddress, controlAddress}) {
    validatePublicKey(publicKey, 'publicKey');
    validateAddress(rewardAddress, 'rewardAddress');
    validateAddress(ownerAddress, 'ownerAddress');
    validateAddress(controlAddress, 'controlAddress');

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
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} rewardAddress
 * @param {Buffer|string} ownerAddress
 * @param {Buffer|string} controlAddress
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromBufferFields = function fromBufferFields({publicKey, rewardAddress, ownerAddress, controlAddress}) {
    return new EditCandidateTxData({
        publicKey: publicToString(publicKey),
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
