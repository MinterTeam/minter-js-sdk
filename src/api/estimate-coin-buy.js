import {convertFromPip, convertToPip} from 'minterjs-util';
import {API_TYPE_EXPLORER, API_TYPE_NODE} from '../variables';

/**
 * @typedef {Object} EstimateBuyResult
 * @property {number|string} will_pay
 * @property {number|string} commission
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
            throw new Error('Coin to buy not specified');
        }
        if (!params.valueToBuy && !params.value_to_buy) {
            throw new Error('Value to buy not specified');
        }
        if (!params.coinToSell && !params.coin_to_sell) {
            throw new Error('Coin to sell not specified');
        }

        const url = apiInstance.defaults.apiType === API_TYPE_EXPLORER
            ? '/api/v1/estimate/coin-buy'
            : '/api/estimateCoinBuy';

        params = apiInstance.defaults.apiType === API_TYPE_EXPLORER ? {
            coinToBuy: params.coinToBuy || params.coin_to_buy,
            valueToBuy: params.valueToBuy || params.value_to_buy,
            coinToSell: params.coinToSell || params.coin_to_sell,
        } : {
            coin_to_buy: params.coinToBuy || params.coin_to_buy,
            value_to_buy: params.valueToBuy || params.value_to_buy,
            coin_to_sell: params.coinToSell || params.coin_to_sell,
        };

        // send pips to the node
        if (apiInstance.defaults.apiType === API_TYPE_EXPLORER) {
            params.valueToBuy = convertToPip(params.valueToBuy);
        }
        if (apiInstance.defaults.apiType === API_TYPE_NODE) {
            params.value_to_buy = convertToPip(params.value_to_buy);
        }

        return apiInstance.get(url, {params})
            .then((response) => {
                // receive pips from node and convert them
                response.data.result.will_pay = convertFromPip(response.data.result.will_pay);
                response.data.result.commission = convertFromPip(response.data.result.commission);
                return response.data.result;
            });
    };
}
