import {convertFromPip} from 'minterjs-util';
import {ReplaceCoinSymbolByPath} from './replace-coin.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @param {import('axios').AxiosRequestConfig} [factoryExtraAxiosOptions] - options for getting coin id
 * @return {GetPoolInfoInstance}
 */
export default function GetPoolInfo(apiInstance, factoryAxiosOptions, factoryExtraAxiosOptions) {
    const replaceCoinSymbolByPath = ReplaceCoinSymbolByPath(apiInstance, factoryExtraAxiosOptions);
    /**
     * @typedef {Function} GetPoolInfoInstance
     * @param {number|string} coin0 - first coin id
     * @param {number|string} coin1 - second coin id
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @param {import('axios').AxiosRequestConfig} [extraAxiosOptions]
     * @return {Promise<PoolInfo>}
     */
    return async function getPoolInfo(coin0, coin1, axiosOptions, extraAxiosOptions) {
        const coins = await replaceCoinSymbolByPath([coin0, coin1], ['0', '1'], undefined, extraAxiosOptions);
        return apiInstance.get(`swap_pool/${coins[0]}/${coins[1]}`, {
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
