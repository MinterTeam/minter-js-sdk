import {API_TYPE_GATE} from '../variables.js';
import {getData} from './utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 */
export default function PostSignedTx(apiInstance) {
    /**
     * @param {string|Buffer} signedTx
     * @return {Promise<NodeTransaction|{hash: string}>}
     */
    return function postSignedTx(signedTx) {
        if (Buffer.isBuffer(signedTx)) {
            signedTx = `0x${signedTx.toString('hex')}`;
        }

        return apiInstance.post('send_transaction', {
            tx: signedTx,
        })
            .then((response) => {
                const resData = getData(response, apiInstance.defaults.apiType);
                let txData = resData.transaction ? resData.transaction : {hash: resData.hash};
                let txHash = txData.hash.toLowerCase();
                // @TODO is transform needed?
                if (txHash.indexOf('mt') !== 0) {
                    txHash = `Mt${txHash}`;
                } else {
                    txHash = txHash.replace(/^mt/, 'Mt');
                }
                txData.hash = txHash;

                return txData;
            });
    };
}

/**
 * @typedef NodeTransaction
 * @property {string} hash
 * @property {string} raw_tx
 * @property {string} height
 * @property {string} from
 * @property {string} nonce
 * @property {string} gas
 * @property {number} gas_price
 * @property {string} gas_coin
 * @property {number} type
 * @property {TxData} data
 * @property {string} payload
 * @property {Object} tags
 */
