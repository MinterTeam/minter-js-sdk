/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(coin0: number|string, coin1: number|string, axiosOptions: AxiosRequestConfig=): (Promise<PoolInfo>)}
 */
export default function GetPoolInfo(apiInstance) {
    return getPoolInfo;

    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {number|string} coin0 - first coin id
     * @param {number|string} coin1 - second coin id
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<PoolInfo>}
     */
    function getPoolInfo(coin0, coin1, axiosOptions) {
        return apiInstance.get(`swap_pool/${coin0}/${coin1}`, axiosOptions)
            .then((response) => response.data);
    }
}

/**
 * @typedef {Object} PoolInfo
 * @property {string|number} amount0
 * @property {string|number} amount1
 * @property {string|number} liquidity
 */
