import {TxDataDelegate, TxDataSetCandidateOn} from 'minterjs-tx';
// import TxDataSetCandidateOn from 'minterjs-tx/src/tx-data/set-candidate-on.js';
import {publicToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {addTxDataFields} from '../utils.js';

/**
 * @param {string} publicKey
 * @constructor
 */
export default function SetCandidateOnTxData({publicKey}) {
    this.publicKey = publicKey;

    this.txData = new TxDataSetCandidateOn({
        pubKey: toBuffer(publicKey),
    });

    addTxDataFields(this);

    // proxy TxDataSetCandidateOn
    this.raw = this.txData.raw;
    this.serialize = this.txData.serialize;
}

/**
 * @param {Buffer|string} publicKey
 * @return {SetCandidateOnTxData}
 */
SetCandidateOnTxData.fromBufferFields = function fromBufferFields({publicKey}) {
    return new SetCandidateOnTxData({
        publicKey: publicToString(publicKey),
    });
};

/**
 * @param {Buffer|string} data
 * @return {SetCandidateOnTxData}
 */
SetCandidateOnTxData.fromRlp = function fromRlp(data) {
    const txData = new TxDataDelegate(data);
    txData.publicKey = txData.pubKey;
    return SetCandidateOnTxData.fromBufferFields(txData);
};
