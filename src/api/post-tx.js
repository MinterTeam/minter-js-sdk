import {privateToAddressString} from 'minterjs-util';
// import {privateToAddressString} from 'minterjs-util/src/prefix.js';
import PostSignedTx from './post-signed-tx.js';
import GetNonce from './get-nonce.js';
import prepareSignedTx, {prepareTx} from '../tx.js';
import {bufferFromBytes, toInteger} from '../utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 */
export default function PostTx(apiInstance) {
    /**
     * @param {TxParams} txParams
     * @param {Object} options
     * @param {ByteArray} [options.privateKey] - privateKey to sign tx or get nonce
     * @param {string} [options.address] - address to get nonce, useful for multisig txs
     * @param {number} [options.gasRetryLimit]
     * @return {Promise<string>}
     */
    return function postTx(txParams, {privateKey, address, gasRetryLimit = 2} = {}) {
        if (!privateKey && txParams.privateKey) {
            privateKey = txParams.privateKey;
            // eslint-disable-next-line no-console
            console.warn('privateKey field in tx params is deprecated, pass it to the second parameter');
        }
        // @TODO asserts

        return ensureNonce(apiInstance, txParams, {privateKey, address})
            .then((newNonce) => _postTxEnsureGas(apiInstance, {...txParams, nonce: newNonce}, {privateKey, gasRetryLimit}));
    };
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {ByteArray} [privateKey]
 * @return {Promise<string>}
 */
function _postTx(apiInstance, txParams, {privateKey}) {
    if (!txParams.chainId && apiInstance.defaults.chainId) {
        txParams.chainId = apiInstance.defaults.chainId;
    }

    let tx;
    if (!txParams.signatureData && toInteger(txParams.signatureType) !== '2') {
        tx = prepareSignedTx(txParams, {privateKey});
    } else {
        tx = prepareTx(txParams);
    }

    return (new PostSignedTx(apiInstance))(tx.serialize().toString('hex'));
}

/**
 * Send `_postTx()` request and if it fails because of too low gas - make retries
 * On retry `txParams.gasPrice` will be updated with required min gas value from error response.
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @param {ByteArray} [privateKey]
 * @param {number} gasRetryLimit - max number of retries
 * @return {Promise<string>}
 */
function _postTxEnsureGas(apiInstance, txParams, {privateKey, gasRetryLimit}) {
    return _postTx(apiInstance, txParams, {privateKey})
        .catch((error) => {
            // @TODO limit max gas_price to prevent sending tx with to high fees
            if (gasRetryLimit > 0 && isGasError(error)) {
                // make retry
                gasRetryLimit -= 1;
                const minGas = getMinGasFromError(error);
                return _postTxEnsureGas(apiInstance, {...txParams, gasPrice: minGas}, {privateKey, gasRetryLimit});
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
function getTxResult(error) {
    error = error.response?.data?.error;
    // gate moves tx_result into root error, so check it too
    return error && (error.tx_result || error);
}

/**
 * Check if error caused by too low gas
 * @param error
 * @return {boolean}
 */
function isGasError(error) {
    const txResult = getTxResult(error);
    return txResult?.code === 114;
}

/**
 * Retrieve required min gas value from error message
 * @param error
 * @return {number}
 */
function getMinGasFromError(error) {
    const txResult = getTxResult(error);
    return Number(txResult.message.replace('Gas price of tx is too low to be included in mempool. Expected ', ''));
}
