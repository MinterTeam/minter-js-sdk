import {API_TYPE_GATE} from '../variables.js';


/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<number>)}
 */
export default function GetNonce(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string} address
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number>}
     */
    return function getNonce(address, axiosOptions) {
        const nonceUrl = apiInstance.defaults.apiType === API_TYPE_GATE
            ? `nonce/${address}`
            : `address/${address}`;

        return apiInstance.get(nonceUrl, axiosOptions)
            .then((response) => {
                const resData = response.data;
                const nonce = apiInstance.defaults.apiType === API_TYPE_GATE ? resData.nonce : resData.transaction_count;
                return Number(nonce) + 1;
            });
    };
}
