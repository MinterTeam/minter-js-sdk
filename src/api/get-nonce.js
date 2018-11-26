import {API_TYPE_EXPLORER} from '~/src/variables';


/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<number>)}
 * @constructor
 */
export default function GetNonce(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string} address
     * @return {Promise<number>}
     */
    return function getNonce(address) {
        const nonceUrl = apiInstance.defaults.apiType === API_TYPE_EXPLORER
            ? `/api/v1/transaction/get-count/${address}`
            : `/api/transactionCount/${address}`;

        return apiInstance.get(nonceUrl)
            .then((response) => Number(response.data.result.count) + 1);
    };
}
