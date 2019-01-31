import {Buffer} from 'safe-buffer';
import {privateToAddressString} from 'minterjs-util/src/prefix';
import GetNonce from './get-nonce';
import prepareSignedTx from '../prepare-tx';
import {API_TYPE_EXPLORER} from '../variables';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 * @constructor
 */
export default function PostTx(apiInstance) {
    /**
     * @param {TxParams} txParams
     * @param {Object} options
     * @parab {number} options.gasRetryLimit
     * @return {Promise<string>}
     */
    return function postTx(txParams, {gasRetryLimit = 2} = {}) {
        const privateKey = txParams.privateKey;
        const nonce = txParams.nonce;
        // @TODO asserts
        // ensure nonce
        const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;
        const address = privateToAddressString(privateKeyBuffer);
        const noncePromise = nonce ? Promise.resolve(nonce) : (new GetNonce(apiInstance))(address);

        return noncePromise
            .then((newNonce) => _postTxEnsureGas(apiInstance, {...txParams, nonce: newNonce}, gasRetryLimit));

        // return new Promise((resolve, reject) => {
        //     noncePromise
        //         .then((newNonce) => {
        //             _postTx(apiInstance, {...txParams, nonce: newNonce})
        //                 .then(resolve)
        //                 .catch(reject);
        //
        //         })
        //         .catch(reject);
        // });
    };
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @return {Promise<string>}
 */
function _postTx(apiInstance, txParams) {
    const tx = prepareSignedTx(txParams);

    let postTxPromise;
    if (apiInstance.defaults.apiType === API_TYPE_EXPLORER) {
        postTxPromise = apiInstance.post('/api/v1/transaction/push', {
            transaction: tx.serialize().toString('hex'),
        });
    } else {
        postTxPromise = apiInstance.get(`/send_transaction?tx=0x${tx.serialize().toString('hex')}`);
    }

    return postTxPromise
        .then((response) => {
            let txHash = response.data.result.hash.toLowerCase();
            if (txHash.indexOf('mt') !== 0) {
                txHash = `Mt${txHash}`;
            } else {
                txHash = txHash.replace(/^mt/, 'Mt');
            }

            return txHash;
        });
}

/**
 * Send `_postTx()` request and if it fails because of too low gas - make retries
 * On retry `txParams.gasPrice` will be updated with required min gas value from error response.
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {number} gasRetryLimit - max number of retries
 * @return {Promise<string>}
 */
function _postTxEnsureGas(apiInstance, txParams, gasRetryLimit) {
    return _postTx(apiInstance, txParams)
        .catch((error) => {
            if (gasRetryLimit > 0 && isGasError(error)) {
                // make retry
                gasRetryLimit -= 1;
                const minGas = getMinGas(error);
                return new Promise((resolve) => {
                    // low gas tx always goes into mempool, so no new tx in this block allowed, wait for new block
                    setTimeout(resolve, 5000);
                })
                    .then(() => _postTxEnsureGas(apiInstance, {...txParams, gasPrice: minGas}, gasRetryLimit));
            } else {
                throw error;
            }
        });
}


/**
 * @param error
 * @return {Object|undefined}
 */
function getTxResult(error) {
    error = error.response && error.response.data && error.response.data.error;
    // explorer moves tx_result into root error, so check it too
    return error && (error.tx_result || error);
}

/**
 * Check if error caused by too low gas
 * @param error
 * @return {boolean}
 */
function isGasError(error) {
    const txResult = getTxResult(error);
    return txResult && txResult.code === 114;
}

/**
 * Retrieve min gas value from error message
 * @param error
 * @return {number}
 */
function getMinGas(error) {
    const txResult = getTxResult(error);
    return Number(txResult.message.replace('Gas price of tx is too low to be included in mempool. Expected ', ''));
}
