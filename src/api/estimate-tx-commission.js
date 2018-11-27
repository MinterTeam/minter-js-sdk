import {API_TYPE_EXPLORER} from '../variables';


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
            throw new Error('Transaction not specified');
        }

        const url = apiInstance.defaults.apiType === API_TYPE_EXPLORER
            ? '/api/v1/estimate/tx-commission'
            : '/api/estimateTxCommission';

        params = apiInstance.defaults.apiType === API_TYPE_EXPLORER ? {
            transaction: params.transaction || params.tx,
        } : {
            tx: params.transaction || params.tx,
        };

        return apiInstance.get(url, {params})
            .then((response) => response.data.result.commission);
    };
}
