import {convertFromPip} from 'minterjs-util';

/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {GetPoolInfoInstance}
 */
export default function GetPoolInfo(apiInstance, factoryAxiosOptions) {
    /**
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
            .then((response) => {
                response.data.id = Number(response.data.id);
                return {
                    ...response.data,
                    id: Number(response.data.id),
                    liquidity: convertFromPip(response.data.liquidity),
                    amount0: convertFromPip(response.data.amount0),
                    amount1: convertFromPip(response.data.amount1),
                };
            });
    };
}

/**
 * @typedef {object} PoolInfo
 * @property {number} id
 * @property {string|number} amount0
 * @property {string|number} amount1
 * @property {string|number} liquidity
 */
