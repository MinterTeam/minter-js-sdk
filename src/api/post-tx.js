import {privateToAddressString} from 'minterjs-util';
// import {privateToAddressString} from 'minterjs-util/src/prefix.js';
import PostSignedTx from './post-signed-tx.js';
import GetNonce from './get-nonce.js';
import prepareSignedTx, {prepareTx} from '../tx.js';
import {bufferFromBytes, toInteger, wait} from '../utils.js';

/**
 * @typedef {TxOptions & PostTxOptionsExtra} PostTxOptions
 *
 * @typedef {Object} PostTxOptionsExtra
 * @property {number} [gasRetryLimit] - max number of autofix retries after gas error
 * @property {number} [nonceRetryLimit] - max number of autofix retries after nonce error
 * @preserve {number} [mempoolRetryLimit] - max number of retries after "already exists in mempool" error
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 */
export default function PostTx(apiInstance) {
    /**
     * @param {TxParams} txParams
     * @param {PostTxOptions} options
     * @return {Promise<string>}
     */
    return function postTx(txParams, {gasRetryLimit = 2, mempoolRetryLimit = 0, ...txOptions} = {}) {
        if (!txOptions.privateKey && txParams.privateKey) {
            txOptions.privateKey = txParams.privateKey;
            // eslint-disable-next-line no-console
            console.warn('privateKey field in tx params is deprecated, pass it to the second parameter');
        }
        // @TODO asserts

        return ensureNonce(apiInstance, txParams, txOptions)
            .then((newNonce) => _postTxHandleErrors(apiInstance, {...txParams, nonce: newNonce}, {gasRetryLimit, mempoolRetryLimit, ...txOptions}));
    };
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {TxOptions} [options]
 * @return {Promise<NodeTransaction|{hash: string}>}
 */
function _postTx(apiInstance, txParams, options) {
    if (!txParams.chainId && apiInstance.defaults.chainId) {
        txParams.chainId = apiInstance.defaults.chainId;
    }

    let tx;
    if (!txParams.signatureData && toInteger(txParams.signatureType) !== '2') {
        tx = prepareSignedTx(txParams, options);
    } else {
        tx = prepareTx(txParams, options);
    }

    return (new PostSignedTx(apiInstance))(`0x${tx.serialize().toString('hex')}`);
}

/**
 * Send `_postTx()` request and if it fails because of too low gas or already exists in mempool - make retries
 * On gas retry `txParams.gasPrice` will be updated with required min gas value from error response.
 * On mempool retry request will be sent after 5 seconds (average time of a block) to try put transaction into next block
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {PostTxOptions} options
 * @return {Promise<string>}
 */
function _postTxHandleErrors(apiInstance, txParams, options) {
    const {gasRetryLimit, nonceRetryLimit, mempoolRetryLimit, ...txOptions} = options;
    return _postTx(apiInstance, txParams, txOptions)
        .catch((error) => {
            // @TODO limit max gas_price to prevent sending tx with to high fees
            if (toInteger(txParams.signatureType) !== '2' && gasRetryLimit > 0 && isGasError(error)) {
                const minGas = getMinGasFromError(error);
                // eslint-disable-next-line no-console
                console.log(`make postTx retry, old gasPrice ${txParams.gasPrice}, new gasPrice ${minGas}`);
                return _postTxHandleErrors(apiInstance, {...txParams, gasPrice: minGas}, {...options, gasRetryLimit: gasRetryLimit - 1});
            } else if (toInteger(txParams.signatureType) !== '2' && nonceRetryLimit > 0 && isNonceError(error)) {
                const newNonce = getNonceFromError(error);
                // eslint-disable-next-line no-console
                console.log(`make postTx retry, old nonce ${txParams.nonce}, new nonce ${newNonce}`);
                return _postTxHandleErrors(apiInstance, {...txParams, nonce: newNonce}, {...options, nonceRetryLimit: nonceRetryLimit - 1});
            } else if (mempoolRetryLimit > 0 && isMempoolError(error)) {
                // make retry
                return wait(5000)
                    .then(() => {
                        return _postTxHandleErrors(apiInstance, txParams, {...options, mempoolRetryLimit: mempoolRetryLimit - 1});
                    });
            } else {
                throw error;
            }
        });
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {ByteArray} [privateKey]
 * @param {string} [address]
 * @return {Promise<number>}
 */
function ensureNonce(apiInstance, txParams, {privateKey, address} = {}) {
    const nonce = txParams.nonce;
    if (!nonce && !address && !privateKey) {
        throw new Error('No nonce is given and no address or privateKey to retrieve it from API');
    }
    if (nonce) {
        return Promise.resolve(nonce);
    }
    if (privateKey) {
        const privateKeyBuffer = bufferFromBytes(privateKey);
        address = privateToAddressString(privateKeyBuffer);
    }

    return (new GetNonce(apiInstance))(address);
}

/**
 * @param {MinterApiInstance} apiInstance
 */
export function EnsureNonce(apiInstance) {
    /**
     * @param {TxParams} txParams
     * @param {ByteArray} [privateKey]
     * @param {string} [address]
     * @return {Promise<number>}
     */
    return function apiEnsureNonce() {
        // eslint-disable-next-line prefer-rest-params
        return ensureNonce(apiInstance, ...arguments);
    };
}


/**
 * Get tx_result data from error
 * @param error
 * @return {Object|undefined}
 */
// function getTxResult(error) {
//     error = error.response?.data?.error;
//     // gate moves tx_result into root error, so check it too
//     return error && (error.tx_result || error);
// }

/**
 * Check if error caused by too low gas
 * @param error
 * @return {boolean}
 */
function isGasError(error) {
    return error.response?.data.error.code === '114';
}

/**
 * Check if error caused by: "Tx from address already exists in mempool"
 * @param error
 * @return {boolean}
 */
function isMempoolError(error) {
    return error.response?.data.error.code === '113';
}

/**
 * Check if error caused by nonce
 * @param error
 * @return {boolean}
 */
function isNonceError(error) {
    return error.response?.data.error.code === '101';
}

/**
 * Retrieve required min gas value from error message
 * @param error
 * @return {number}
 */
function getMinGasFromError(error) {
    return Number(error.response?.data.error.data.min_gas_price);
}

/**
 * Retrieve required min gas value from error message
 * @param error
 * @return {number}
 */
function getNonceFromError(error) {
    return Number(error.response?.data.error.data.expected_nonce);
}
