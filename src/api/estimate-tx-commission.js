import {API_TYPE_GATE} from '../variables.js';
import {getData} from './utils.js';


/**
 * @TODO accept txParams
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<string>)}
 */
export default function EstimateTxCommission(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string} tx
     * @return {Promise<number|string>}
     */
    return function estimateTxCommission(tx) {
        if (!tx) {
            return Promise.reject(new Error('Transaction not specified'));
        }

        return apiInstance.get(`estimate_tx_commission/${tx}`)
            .then((response) => {
                return response.data.commission;
            });
    };
}
