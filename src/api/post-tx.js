import {privateToAddressString} from 'minterjs-util';
// import {privateToAddressString} from 'minterjs-util/src/prefix.js';
import PostSignedTx from './post-signed-tx.js';
import GetNonce from './get-nonce.js';
import {ReplaceCoinSymbol} from './replace-coin.js';
import prepareSignedTx, {prepareTx} from '../tx.js';
import {bufferFromBytes, getPrivateKeyFromSeedPhraseAsync, toInteger, wait} from '../utils.js';

/**
 * @typedef {TxOptions & PostTxOptionsExtra} PostTxOptions
 * @typedef {object} PostTxOptionsExtra
 * @property {number} [gasRetryLimit=2] - max number of autofix retries after gas error
 * @property {number} [nonceRetryLimit=0] - max number of autofix retries after nonce error
 * @preserve {number} [mempoolRetryLimit=0] - max number of retries after "already exists in mempool" error
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @param {import('axios').AxiosRequestConfig} [factoryExtraAxiosOptions]
 * @return {PostTxInstance}
 */
export default function PostTx(apiInstance, factoryAxiosOptions, factoryExtraAxiosOptions) {
    const ensureNonce = new EnsureNonce(apiInstance, factoryExtraAxiosOptions);
    const replaceCoinSymbol = new ReplaceCoinSymbol(apiInstance, factoryExtraAxiosOptions);
    /**
     * @typedef {Function} PostTxInstance
     * @param {TxParams} txParams
     * @param {PostTxOptions} options
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @param {import('axios').AxiosRequestConfig} [extraAxiosOptions] - applied to secondary requests
     * @return {Promise<PostTxResponse>}
     */
    return function postTx(txParams, {gasRetryLimit = 2, nonceRetryLimit = 0, mempoolRetryLimit = 0, ...txOptions} = {}, axiosOptions = undefined, extraAxiosOptions = undefined) {
        axiosOptions = {
            ...factoryAxiosOptions,
            ...axiosOptions,
        };
        if (!txOptions.privateKey && txParams.privateKey) {
            txOptions.privateKey = txParams.privateKey;
            // eslint-disable-next-line no-console
            console.warn('privateKey field in tx params is deprecated, pass it to the second parameter');
        }
        // @TODO asserts


        let privateKeyPromise;
        if (txOptions.privateKey) {
            privateKeyPromise = Promise.resolve(txOptions.privateKey);
        } else if (txOptions.seedPhrase) {
            privateKeyPromise = getPrivateKeyFromSeedPhraseAsync(txOptions.seedPhrase);
        } else {
            privateKeyPromise = Promise.resolve(undefined);
        }

        return privateKeyPromise
            .then((privateKey) => {
                return Promise.all([
                    ensureNonce(txParams, {...txOptions, privateKey}, extraAxiosOptions),
                    replaceCoinSymbol(txParams, extraAxiosOptions),
                    Promise.resolve(privateKey),
                ]);
            })
            .then(([newNonce, newTxParams, privateKey]) => _postTxHandleErrors(apiInstance, {...newTxParams, nonce: newNonce}, {gasRetryLimit, nonceRetryLimit, mempoolRetryLimit, ...txOptions, privateKey, axiosOptions}));
    };
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {TxOptions} [options]
 * @param {import('axios').AxiosRequestConfig} [axiosOptions]
 * @return {Promise<PostTxResponse>}
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
 * @param {import('axios').AxiosRequestConfig} [axiosOptions]
 * @return {Promise<PostTxResponse>}
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
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {EnsureNonceInstance}
 */
export function EnsureNonce(apiInstance, factoryAxiosOptions) {
    const getNonce = new GetNonce(apiInstance, factoryAxiosOptions);
    /**
     * @typedef {Function} EnsureNonceInstance
     * @param {TxParams} txParams
     * @param {object} [txOptions]
     * @param {ByteArray} [txOptions.privateKey]
     * @param {string} [txOptions.address]
     * @param {string} [txOptions.seedPhrase]
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number>}
     */
    return function ensureNonce(txParams, {privateKey, address, seedPhrase} = {}, axiosOptions = undefined) {
        const nonce = txParams.nonce;
        if (!nonce && !address && !privateKey) {
            throw new Error('No nonce is given and no address or privateKey to retrieve it from API');
        }
        if (nonce) {
            return Promise.resolve(nonce);
        }
        // @TODO seedPhrase not used
        if (privateKey) {
            const privateKeyBuffer = bufferFromBytes(privateKey);
            address = privateToAddressString(privateKeyBuffer);
        }

        return getNonce(address, axiosOptions);
    };
}


/**
 * Get tx_result data from error
 * @param error
 * @return {object|undefined}
 */
// function getTxResult(error) {
//     error = error.response?.data?.error;
//     // gate moves tx_result into root error, so check it too
//     return error && (error.tx_result || error);
// }

/**
 * Check if error caused by too low gas
 * @param {AxiosError} error
 * @return {boolean}
 */
function isGasError(error) {
    return error.response?.data.error.code === '114';
}

/**
 * Check if error caused by: "Tx from address already exists in mempool"
 * @param {AxiosError} error
 * @return {boolean}
 */
function isMempoolError(error) {
    return error.response?.data.error.code === '113';
}

/**
 * Check if error caused by nonce
 * @param {AxiosError} error
 * @return {boolean}
 */
function isNonceError(error) {
    return error.response?.data.error.code === '101';
}

/**
 * Retrieve required min gas value from error message
 * @param {AxiosError} error
 * @return {number}
 */
function getMinGasFromError(error) {
    return Number(error.response?.data.error.data.min_gas_price);
}

/**
 * Retrieve required min gas value from error message
 * @param {AxiosError} error
 * @return {number}
 */
function getNonceFromError(error) {
    return Number(error.response?.data.error.data.expected_nonce);
}
