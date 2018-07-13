import axios from 'axios';
import MinterTx from "minterjs-tx";
import ethUtil from "ethereumjs-util";
import {Buffer} from "safe-buffer";

/**
 * @param nodeUrl
 * @param address
 * @return {Promise<number>}
 */
export function getNonce(nodeUrl, address) {
    return axios.get(`${nodeUrl}/api/transactionCount/${address}`)
        .then((response) => Number(response.data.result) + 1);
}

/**
 * @param {string} nodeUrl
 * @param {string|Buffer} privateKey
 * @param {string|Buffer} txType
 * @param {Buffer} txData
 * @param {string} message
 * @return {Promise<any>}
 */
export function sendTx({nodeUrl, privateKey, txType, txData, message}) {
    //@TODO asserts
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    return new Promise((resolve, reject) => {
        getNonce(nodeUrl, ethUtil.privateToAddress(privateKey).toString('hex'))
            .then((nonce) => {
                const txParams = {
                    nonce: `0x${nonce.toString(16)}`,
                    gasPrice: '0x01',
                    type: txType,
                    data: txData.serialize(),
                };
                if (message) {
                    txParams.payload = `0x${Buffer.from(message, 'utf-8').toString('hex')}`;
                }

                const tx = new MinterTx(txParams);
                tx.sign(privateKey);

                axios.post(`${nodeUrl}/api/sendTransaction`, {
                    transaction: tx.serialize().toString('hex'),
                })
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject)
    })
}
