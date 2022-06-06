import {API_TYPE_GATE} from '../variables.js';


/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {GetNonceInstance}
 */
export default function GetNonce(apiInstance, factoryAxiosOptions) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @typedef {Function} GetNonceInstance
     * @param {string} address
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number>}
     */
    return function getNonce(address, axiosOptions) {
        const nonceUrl = apiInstance.defaults.apiType === API_TYPE_GATE
            ? `nonce/${address}`
            : `address/${address}`;

        return apiInstance.get(nonceUrl, {
            ...factoryAxiosOptions,
            ...axiosOptions,
        })
            .then((response) => {
                const resData = response.data;
                const nonce = apiInstance.defaults.apiType === API_TYPE_GATE ? resData.nonce : resData.transaction_count;
                const newNonce = Number(nonce) + 1;
                if (Number.isNaN(newNonce)) {
                    // eslint-disable-next-line unicorn/prefer-type-error
                    throw new Error(`Can't get nonce, API returns '${nonce}'`);
                }

                return newNonce;
            });
    };
}
