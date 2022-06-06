/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {GetPoolInfoInstance}
 */
export default function GetPoolInfo(apiInstance, factoryAxiosOptions) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @typedef {Function} GetPoolInfoInstance
     * @param {number|string} coin0 - first coin id
     * @param {number|string} coin1 - second coin id
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<PoolInfo>}
     */
    return function getPoolInfo(coin0, coin1, axiosOptions) {
        return apiInstance.get(`swap_pool/${coin0}/${coin1}`, {
            ...factoryAxiosOptions,
            ...axiosOptions,
        })
            .then((response) => response.data);
    };
}

/**
 * @typedef {object} PoolInfo
 * @property {string|number} amount0
 * @property {string|number} amount1
 * @property {string|number} liquidity
 */
