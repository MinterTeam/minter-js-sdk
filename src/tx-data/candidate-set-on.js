import {TxDataSetCandidateOn} from 'minterjs-tx';
// import TxDataSetCandidateOn from 'minterjs-tx/src/tx-data/set-candidate-on.js';
import {publicToString, toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {proxyNestedTxData, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @constructor
 */
export default function SetCandidateOnTxData({publicKey}) {
    validatePublicKey(publicKey, 'publicKey');

    this.publicKey = publicKey;

    this.txData = new TxDataSetCandidateOn({
        publicKey: toBuffer(publicKey),
    });

    proxyNestedTxData(this);
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
    return SetCandidateOnTxData.fromBufferFields(new TxDataSetCandidateOn(data));
};
