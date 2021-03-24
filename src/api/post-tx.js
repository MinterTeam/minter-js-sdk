import {privateToAddressString} from 'minterjs-util';
// import {privateToAddressString} from 'minterjs-util/src/prefix.js';
import PostSignedTx from './post-signed-tx.js';
import GetNonce from './get-nonce.js';
import {ReplaceCoinSymbol} from './replace-coin.js';
import prepareSignedTx, {prepareTx} from '../tx.js';
import {bufferFromBytes, toInteger, wait} from '../utils.js';

/**
 * @typedef {TxOptions & PostTxOptionsExtra} PostTxOptions
 *
 * @typedef {Object} PostTxOptionsExtra
 * @property {number} [gasRetryLimit=2] - max number of autofix retries after gas error
 * @property {number} [nonceRetryLimit=0] - max number of autofix retries after nonce error
 * @preserve {number} [mempoolRetryLimit=0] - max number of retries after "already exists in mempool" error
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 */
export default function PostTx(apiInstance) {
    const replaceCoinSymbol = new ReplaceCoinSymbol(apiInstance);
    /**
     * @param {TxParams} txParams
     * @param {PostTxOptions} options
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<string>}
     */
    return function postTx(txParams, {gasRetryLimit = 2, nonceRetryLimit = 0, mempoolRetryLimit = 0, ...txOptions} = {}, axiosOptions) {
        if (!txOptions.privateKey && txParams.privateKey) {
            txOptions.privateKey = txParams.privateKey;
            // eslint-disable-next-line no-console
            console.warn('privateKey field in tx params is deprecated, pass it to the second parameter');
        }
        // @TODO asserts

        // @TODO should axiosOptions be passed here?
        return Promise.all([
            ensureNonce(apiInstance, txParams, txOptions),
            replaceCoinSymbol(txParams),
        ])
            .then(([newNonce, newTxParams]) => _postTxHandleErrors(apiInstance, {...newTxParams, nonce: newNonce}, {gasRetryLimit, nonceRetryLimit, mempoolRetryLimit, ...txOptions, axiosOptions}));
    };
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {TxOptions} [options]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<NodeTransaction|{hash: string}>}
 */
function _postTx(apiInstance, txParams, options, axiosOptions) {
    if (!txParams.chainId && apiInstance.defaults.chainId) {
        txParams.chainId = apiInstance.defaults.chainId;
    }

    let tx;
    tx = !txParams.signatureData && toInteger(txParams.signatureType) !== '2' ? prepareSignedTx(txParams, options) : prepareTx(txParams, options);

    return (new PostSignedTx(apiInstance))(tx.serializeToString(), axiosOptions);
}

/**
 * Send `_postTx()` request and if it fails because of too low gas or already exists in mempool - make retries
 * On gas retry `txParams.gasPrice` will be updated with required min gas value from error response.
 * On mempool retry request will be sent after 5 seconds (average time of a block) to try put transaction into next block
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {PostTxOptions} options
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<string>}
 */
function _postTxHandleErrors(apiInstance, txParams, options, axiosOptions) {
    const {gasRetryLimit, nonceRetryLimit, mempoolRetryLimit, ...txOptions} = options;
    return _postTx(apiInstance, txParams, txOptions, axiosOptions)
        .catch((error) => {
            // @TODO limit max gas_price to prevent sending tx with to high fees
            if (toInteger(txParams.signatureType) !== '2' && gasRetryLimit > 0 && isGasError(error)) {
                const minGas = getMinGasFromError(error);
                // eslint-disable-next-line no-console
                console.log(`make postTx retry, old gasPrice ${txParams.gasPrice}, new gasPrice ${minGas}`);
                return _postTxHandleErrors(apiInstance, {...txParams, gasPrice: minGas}, {...options, gasRetryLimit: gasRetryLimit - 1}, axiosOptions);
            } else if (toInteger(txParams.signatureType) !== '2' && nonceRetryLimit > 0 && isNonceError(error)) {
                const newNonce = getNonceFromError(error);
                // eslint-disable-next-line no-console
                console.log(`make postTx retry, old nonce ${txParams.nonce}, new nonce ${newNonce}`);
                return _postTxHandleErrors(apiInstance, {...txParams, nonce: newNonce}, {...options, nonceRetryLimit: nonceRetryLimit - 1}, axiosOptions);
            } else if (mempoolRetryLimit > 0 && isMempoolError(error)) {
                // eslint-disable-next-line no-console
                console.log('make postTx retry: tx exists in mempool');
                return wait(5000)
                    .then(() => {
                        return _postTxHandleErrors(apiInstance, txParams, {...options, mempoolRetryLimit: mempoolRetryLimit - 1}, axiosOptions);
                    });
            } else {
                throw error;
            }
        });
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {Object} txOptions
 * @param {ByteArray} [txOptions.privateKey]
 * @param {string} [txOptions.address]
 * @param {AxiosRequestConfig} [axiosOptions]
 * @return {Promise<number>}
 */
function ensureNonce(apiInstance, txParams, {privateKey, address} = {}, axiosOptions) {
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

    return (new GetNonce(apiInstance))(address, axiosOptions);
}

/**
 * @param {MinterApiInstance} apiInstance
 */
export function EnsureNonce(apiInstance) {
    /**
     * @param {TxParams} txParams
     * @param {Object} txOptions
     * @param {ByteArray} [txOptions.privateKey]
     * @param {string} [txOptions.address]
     * @param {AxiosRequestConfig} [axiosOptions]
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
