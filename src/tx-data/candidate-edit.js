import {TxDataEditCandidate} from 'minterjs-tx';
// import TxDataEditCandidate from 'minterjs-tx/src/tx-data/edit-candidate';
import {addressToString, publicToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';

/**
 * @param {string} publicKey
 * @param {string} rewardAddress
 * @param {string} ownerAddress
 * @constructor
 */
export default function EditCandidateTxData({publicKey, rewardAddress, ownerAddress}) {
    this.publicKey = publicKey;
    this.rewardAddress = rewardAddress;
    this.ownerAddress = ownerAddress;

    this.txData = new TxDataEditCandidate({
        pubKey: toBuffer(publicKey),
        rewardAddress: toBuffer(rewardAddress),
        ownerAddress: toBuffer(ownerAddress),
    });

    // proxy TxDataEditCandidate
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} publicKey
 * @param {Buffer|string} rewardAddress
 * @param {Buffer|string} ownerAddress
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromBufferFields = function fromBufferFields({publicKey, rewardAddress, ownerAddress}) {
    return new EditCandidateTxData({
        publicKey: publicToString(publicKey),
        rewardAddress: addressToString(rewardAddress),
        ownerAddress: addressToString(ownerAddress),
    });
};

/**
 * @param {Buffer|string} data
 * @return {EditCandidateTxData}
 */
EditCandidateTxData.fromRlp = function fromRlp(data) {
    const txData = new TxDataEditCandidate(data);
    txData.publicKey = txData.pubKey;
    return EditCandidateTxData.fromBufferFields(txData);
};
