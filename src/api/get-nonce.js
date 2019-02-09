import {API_TYPE_EXPLORER} from '../variables';


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
            : `/address?address=${address}`;

        return apiInstance.get(nonceUrl)
            .then((response) => {
                const nonce = apiInstance.defaults.apiType === API_TYPE_EXPLORER ? response.data.result.count : response.data.result.transaction_count;
                return Number(nonce) + 1;
            });
    };
}