import {Buffer} from 'safe-buffer';
import {API_TYPE_GATE} from '../variables';
import {getData} from './utils';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {Function<Promise>}
 * @constructor
 */
export default function PostSignedTx(apiInstance) {
    /**
     * @param {string|Buffer} signedTx
     * @return {Promise<string>}
     */
    return function postSignedTx(signedTx) {
        if (Buffer.isBuffer(signedTx)) {
            signedTx = signedTx.toString('hex');
        }

        let postTxPromise;
        if (apiInstance.defaults.apiType === API_TYPE_GATE) {
            postTxPromise = apiInstance.post('transaction/push', {
                transaction: signedTx,
            });
        } else {
            postTxPromise = apiInstance.get(`send_transaction?tx=0x${signedTx}`);
        }

        return postTxPromise
            .then((response) => {
                const resData = getData(response, apiInstance.defaults.apiType);
                let txHash = resData.hash.toLowerCase();
                // @TODO is transform needed?
                if (txHash.indexOf('mt') !== 0) {
                    txHash = `Mt${txHash}`;
                } else {
                    txHash = txHash.replace(/^mt/, 'Mt');
                }

                return txHash;
            });
    };
}
