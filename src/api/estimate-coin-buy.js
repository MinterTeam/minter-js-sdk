import {stringify as qsStringify} from 'qs';
import {convertFromPip, convertToPip} from 'minterjs-util';
// import {convertFromPip, convertToPip} from 'minterjs-util/src/converter.js';
import {isCoinId, isValidNumber} from '../utils.js';

/**
 * @typedef {object} EstimateBuyResult
 * @property {number|string} will_pay - amount of coinToSell
 * @property {number|string} commission - amount of coinToSell to pay fee
 * @property {"pool"|"bancor"} swap_from
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {EstimateCoinBuyInstance}
 */
export default function EstimateCoinBuy(apiInstance, factoryAxiosOptions) {
    /**
     * @typedef {Function} EstimateCoinBuyInstance
     * @param {object} params
     * @param {string|number} params.coinToBuy - ID or symbol of the coin to buy
     * @param {string|number} params.valueToBuy
     * @param {string|number} params.coinToSell - ID or symbol of the coin to sell
     * @param {ESTIMATE_SWAP_TYPE} [params.swapFrom] - estimate from pool, bancor or optimal
     * @param {Array<string|number>} [params.route] - IDs of intermediate coins for pool swaps
     * @param {string|number} [params.gasCoin]
     * @param {string|number} [params.coinCommission] - gasCoin alias
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<EstimateBuyResult>}
     */
    return function estimateCoinBuy(params, axiosOptions) {
        if (params.coinIdToSell || params.coinIdToSell === 0) {
            params.coinToSell = params.coinIdToSell;
            // eslint-disable-next-line no-console
            console.warn('coinIdToSell is deprecated, use coinToSell instead');
        }
        if (params.coinIdToBuy || params.coinIdToBuy === 0) {
            params.coinToBuy = params.coinIdToBuy;
            // eslint-disable-next-line no-console
            console.warn('coinIdToSell is deprecated, use coinToSell instead');
        }

        if (!params.coinToBuy && params.coinToBuy !== 0) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }
        if (!params.valueToBuy) {
            return Promise.reject(new Error('Value to buy not specified'));
        }
        if (!params.coinToSell && params.coinToSell !== 0) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }

        const gasCoin = (params.gasCoin || params.gasCoin === 0) ? params.gasCoin : params.coinCommission;

        params = {
            coin_id_to_buy: isCoinId(params.coinToBuy) ? params.coinToBuy : undefined,
            coin_to_buy: !isCoinId(params.coinToBuy) ? params.coinToBuy : undefined,
            value_to_buy: convertToPip(params.valueToBuy),
            coin_id_to_sell: isCoinId(params.coinToSell) ? params.coinToSell : undefined,
            coin_to_sell: !isCoinId(params.coinToSell) ? params.coinToSell : undefined,
            swap_from: params.swapFrom,
            route: params.route,
            coin_id_commission: isCoinId(gasCoin) ? gasCoin : undefined,
            coin_commission: !isCoinId(gasCoin) ? gasCoin : undefined,
        };

        return apiInstance.get('estimate_coin_buy', {
            ...factoryAxiosOptions,
            ...axiosOptions,
            params,
            paramsSerializer: (query) => qsStringify(query, {arrayFormat: 'repeat'}),
        })
            .then((response) => {
                const resData = response.data;
                if (!isValidNumber(resData.will_pay)) {
                    throw new Error('Invalid estimation data, `will_pay` not specified');
                }
                if (!isValidNumber(resData.commission)) {
                    throw new Error('Invalid estimation data, `commission` not specified');
                }

                return {
                    ...resData,
                    // convert pips
                    will_pay: convertFromPip(resData.will_pay),
                    commission: convertFromPip(resData.commission),
                };
            });
    };
}
