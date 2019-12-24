import {TxDataDelegate, TxDataSetCandidateOn} from 'minterjs-tx';
// import TxDataSetCandidateOn from 'minterjs-tx/src/tx-data/set-candidate-On';
import {publicToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix';

/**
 * @param {string} publicKey
 * @constructor
 */
export default function SetCandidateOnTxData({publicKey}) {
    this.publicKey = publicKey;

    this.txData = new TxDataSetCandidateOn({
        publicKey: toBuffer(publicKey),
    });

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
    return SetCandidateOnTxData.fromBufferFields(new TxDataDelegate(data));
};
