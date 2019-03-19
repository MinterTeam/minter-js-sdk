import {API_TYPE_GATE} from '../variables';
import {getData} from './utils';


/**
 * @TODO accept txParams
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<string>)}
 * @constructor
 */
export default function EstimateTxCommission(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {Object} params
     * @param {string} [params.tx] - rawTx
     * @param {string} [params.transaction] - rawTx
     * @return {Promise<string>}
     */
    return function estimateCoinBuy(params) {
        if (!params.tx && !params.transaction) {
            return Promise.reject(new Error('Transaction not specified'));
        }

        const url = apiInstance.defaults.apiType === API_TYPE_GATE
            ? '/api/v1/estimate/tx-commission'
            : '/estimate_tx_commission';

        params = apiInstance.defaults.apiType === API_TYPE_GATE ? {
            transaction: params.transaction || params.tx,
        } : {
            tx: `0x${params.transaction || params.tx}`,
        };

        return apiInstance.get(url, {params})
            .then((response) => {
                const resData = getData(response, apiInstance.defaults.apiType);
                return resData.commission;
            });
    };
}
