import {convertFromPip, convertToPip} from 'minterjs-util';
import {API_TYPE_GATE, API_TYPE_NODE} from '../variables';
import {getData} from './utils';

/**
 * @typedef {Object} EstimateBuyResult
 * @property {number|string} will_pay - amount of coinToSell
 * @property {number|string} commission - amount of coinToSell to pay fee
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<EstimateBuyResult>)}
 * @constructor
 */
export default function EstimateCoinBuy(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {Object} params
     *
     * @param {string} [params.coinToBuy]
     * @param {string|number} [params.valueToBuy]
     * @param {string} [params.coinToSell]
     *
     * @param {string} [params.coin_to_buy]
     * @param {string|number} [params.value_to_buy]
     * @param {string} [params.coin_to_sell]
     *
     * @return {Promise<EstimateBuyResult>}
     */
    return function estimateCoinBuy(params) {
        if (!params.coinToBuy && !params.coin_to_buy) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }
        if (!params.valueToBuy && !params.value_to_buy) {
            return Promise.reject(new Error('Value to buy not specified'));
        }
        if (!params.coinToSell && !params.coin_to_sell) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }

        const url = apiInstance.defaults.apiType === API_TYPE_GATE
            ? 'estimate/coin-buy'
            : 'estimate_coin_buy';

        params = apiInstance.defaults.apiType === API_TYPE_GATE ? {
            coinToBuy: params.coinToBuy || params.coin_to_buy,
            valueToBuy: convertToPip(params.valueToBuy || params.value_to_buy),
            coinToSell: params.coinToSell || params.coin_to_sell,
        } : {
            coin_to_buy: params.coinToBuy || params.coin_to_buy,
            value_to_buy: convertToPip(params.valueToBuy || params.value_to_buy),
            coin_to_sell: params.coinToSell || params.coin_to_sell,
        };

        return apiInstance.get(url, {params})
            .then((response) => {
                const resData = getData(response, apiInstance.defaults.apiType);
                // convert pips
                return {
                    will_pay: convertFromPip(resData.will_pay),
                    commission: convertFromPip(resData.commission),
                };
            });
    };
}
