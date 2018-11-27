import {Buffer} from 'safe-buffer';
import ethUtil from 'ethereumjs-util';
import {formatCoin} from 'minterjs-tx/src/helpers';
import MinterTx from 'minterjs-tx';
import MinterTxSignature from 'minterjs-tx/src/tx-signature';
import GetNonce from './get-nonce';
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
        const {privateKey, gasCoin = 'BIP', txType, txData, message} = txParams;
        // @TODO asserts
        const privateKeyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'hex') : privateKey;
        const address = ethUtil.privateToAddress(privateKeyBuffer).toString('hex');
        const noncePromise = nonce ? Promise.resolve(nonce) : (new GetNonce(apiInstance))(address);
        return new Promise((resolve, reject) => {
            noncePromise
                .then((newNonce) => {
                    const txProps = {
                        nonce: `0x${newNonce.toString(16)}`,
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

                    apiInstance.post(apiInstance.defaults.apiType === API_TYPE_EXPLORER ? '/api/v1/transaction/push' : '/api/sendTransaction', {
                        transaction: tx.serialize().toString('hex'),
                    })
                        .then((response) => resolve(response.data.result.hash))
                        .catch(reject);
                })
                .catch(reject);
        });
    };
}
