import {Buffer} from 'safe-buffer';
import {privateToAddressString} from 'minterjs-util/src/prefix';
import GetNonce from './get-nonce';
import prepareSignedTx from '../prepare-tx';
import {API_TYPE_EXPLORER} from '../variables';

/**
 * @typedef {Object} TxParams
 * @property {string|Buffer} privateKey
 * @property {string} gasCoin
 * @property {string|Buffer} txType
 * @property {Buffer} txData
 * @property {string} [message]
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 * @constructor
 */
export default function PostTx(apiInstance) {
    /**
     * @param {TxParams} txParams
     * @param {string|Buffer} txParams.privateKey
     * @param {string} txParams.gasCoin
     * @param {string|Buffer} txParams.txType
     * @param {Buffer} txParams.txData
     * @param {string} txParams.message
     * @param {number} [nonce]
     * @return {Promise<string>}
     */
    return function postTx(txParams, nonce) {
        const privateKey = txParams.privateKey;
        // @TODO asserts
        const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;
        const address = privateToAddressString(privateKeyBuffer);
        const noncePromise = nonce ? Promise.resolve(nonce) : (new GetNonce(apiInstance))(address);
        return new Promise((resolve, reject) => {
            noncePromise
                .then((newNonce) => {
                    const tx = prepareSignedTx(txParams, newNonce);

                    let postTxPromise;
                    if (apiInstance.defaults.apiType === API_TYPE_EXPLORER) {
                        postTxPromise = apiInstance.post('/api/v1/transaction/push', {
                            transaction: tx.serialize().toString('hex'),
                        });
                    } else {
                        postTxPromise = apiInstance.get(`/send_transaction?tx=0x${tx.serialize().toString('hex')}`);
                    }

                    postTxPromise
                        .then((response) => {
                            let txHash = response.data.result.hash.toLowerCase();
                            if (txHash.indexOf('mt') !== 0) {
                                txHash = `Mt${txHash}`;
                            } else {
                                txHash = txHash.replace(/^mt/, 'Mt');
                            }
                            resolve(txHash);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    };
}
