import {privateToAddressString} from 'minterjs-util';
// import {privateToAddressString} from 'minterjs-util/src/prefix';
import PostSignedTx from './post-signed-tx';
import GetNonce from './get-nonce';
import prepareSignedTx from '../tx';

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
    };
}

/**
 * @param {MinterApiInstance} apiInstance
 * @param {TxParams} txParams
 * @return {Promise<string>}
 */
function _postTx(apiInstance, txParams) {
    if (!txParams.chainId && apiInstance.defaults.chainId) {
        txParams.chainId = apiInstance.defaults.chainId;
    }
    const tx = prepareSignedTx(txParams);

    return (new PostSignedTx(apiInstance))(tx.serialize().toString('hex'));
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
            // @TODO limit max gas_price to prevent sending tx with to high fees
            if (gasRetryLimit > 0 && isGasError(error)) {
                // make retry
                gasRetryLimit -= 1;
                const minGas = getMinGas(error);
                return new Promise((resolve) => {
                    // low gas tx always goes into mempool, so no new tx in this block allowed, wait for new block
                    // @TODO https://github.com/MinterTeam/minter-go-node/issues/220
                    setTimeout(resolve, 5000);
                })
                    .then(() => _postTxEnsureGas(apiInstance, {...txParams, gasPrice: minGas}, gasRetryLimit));
            } else {
                throw error;
            }
        });
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
function getMinGas(error) {
    const txResult = getTxResult(error);
    return Number(txResult.message.replace('Gas price of tx is too low to be included in mempool. Expected ', ''));
}
