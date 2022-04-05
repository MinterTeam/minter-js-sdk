import {TxDataSetCandidateOn} from 'minterjs-tx';
// import TxDataSetCandidateOn from 'minterjs-tx/src/tx-data/set-candidate-on.js';
import {toBuffer} from 'minterjs-util';
// import {toBuffer} from 'minterjs-util/src/prefix.js';
import {dataToPublicKey, proxyNestedTxData, validatePublicKey} from '../utils.js';

/**
 * @param {string} publicKey
 * @param {TxOptions} [options]
 * @constructor
 */
export default function SetCandidateOnTxData({publicKey}, options = {}) {
    if (!options.disableValidation) {
        validatePublicKey(publicKey, 'publicKey');
    }

    this.publicKey = publicKey;

    this.txData = new TxDataSetCandidateOn({
        publicKey: toBuffer(publicKey),
    });

    proxyNestedTxData(this);
}

/**
 * @param {Buffer|string} publicKey
 * @param {TxOptions} [options]
 * @return {SetCandidateOnTxData}
 */
SetCandidateOnTxData.fromBufferFields = function fromBufferFields({publicKey}, options = {}) {
    return new SetCandidateOnTxData({
        publicKey: dataToPublicKey(publicKey),
    }, options);
};

/**
 * @param {Buffer|string} data
 * @return {SetCandidateOnTxData}
 */
SetCandidateOnTxData.fromRlp = function fromRlp(data) {
    return SetCandidateOnTxData.fromBufferFields(new TxDataSetCandidateOn(data));
};
