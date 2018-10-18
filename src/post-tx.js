import axios from 'axios';
import MinterTx from 'minterjs-tx';
import MinterTxSignature from 'minterjs-tx/src/tx-signature';
import {formatCoin} from 'minterjs-tx/src/helpers';
import ethUtil from 'ethereumjs-util';
import {Buffer} from 'safe-buffer';


const API_TYPE_EXPLORER = 'explorer';
const API_TYPE_NODE = 'node';

/**
 * @typedef {Object} TxParams
 * @property {string|Buffer} privateKey
 * @property {string} gasCoin
 * @property {string|Buffer} txType
 * @property {Buffer} txData
 * @property {string} [message]
 */

/**
 * @param {Object} [options]
 * @param {string} [options.apiType]
 * @param {string} [options.baseURL]
 * @return {Function<Promise>}
 */
export default function PostTx(options = {}) {
    if (!options.apiType && !options.baseURL) {
        options.apiType = API_TYPE_EXPLORER;
    }
    if (!options.apiType && options.baseURL) {
        options.apiType = API_TYPE_NODE;
    }
    if (options.apiType === API_TYPE_EXPLORER && !options.baseURL) {
        options.baseURL = 'https://testnet.explorer.minter.network';
    }
    // transform response from explorer to node api format
    if (options.apiType === API_TYPE_EXPLORER) {
        if (!Array.isArray(options.transformResponse)) {
            options.transformResponse = options.transformResponse ? [options.transformResponse] : [];
        }
        options.transformResponse.push((data) => {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            // transform then
            if (data.data) {
                data.result = data.data;
                delete data.data;
            }
            // transform catch
            if (data.error) {
                data = data.error;
            }
            return data;
        });
    }
    const apiInstance = axios.create(options);

    /**
     * @param {TxParams} txParams
     * @param {string|Buffer} txParams.privateKey
     * @param {string} txParams.gasCoin
     * @param {string|Buffer} txParams.txType
     * @param {Buffer} txParams.txData
     * @param {string} txParams.message
     * @return {Promise}
     */
    return function postTx(txParams) {
        const {privateKey, gasCoin = 'BIP', txType, txData, message} = txParams;
        // @TODO asserts
        const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;
        const address = ethUtil.privateToAddress(privateKeyBuffer).toString('hex');
        return new Promise((resolve, reject) => {
            getNonce(apiInstance, address)
                .then((nonce) => {
                    const txProps = {
                        nonce: `0x${nonce.toString(16)}`,
                        gasPrice: '0x01',
                        gasCoin: formatCoin(gasCoin),
                        type: txType,
                        data: txData,
                        signatureType: '0x01',
                    };
                    if (message) {
                        txProps.payload = `0x${Buffer.from(message, 'utf-8').toString('hex')}`;
                    }

                    const tx = new MinterTx(txProps);
                    tx.signatureData = (new MinterTxSignature()).sign(tx.hash(false), privateKeyBuffer).serialize();

                    apiInstance.post(options.apiType === API_TYPE_EXPLORER ? '/api/v1/transaction/push' : '/api/sendTransaction', {
                        transaction: tx.serialize().toString('hex'),
                    })
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    };
}

/**
 * Get nonce for new transaction: last transaction number + 1
 * @param {AxiosInstance} apiInstance
 * @param {string} address
 * @return {Promise<number>}
 */
export function getNonce(apiInstance, address) {
    const nonceUrl = apiInstance.defaults.apiType === API_TYPE_EXPLORER
        ? `/api/v1/transaction/get-count/${address}`
        : `/api/transactionCount/${address}`;

    return apiInstance.get(nonceUrl)
        .then((response) => Number(response.data.result.count) + 1);
}
