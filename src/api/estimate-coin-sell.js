import {convertFromPip, convertToPip} from 'minterjs-util';
// import {convertFromPip, convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @typedef {Object} EstimateSellResult
 * @property {number|string} will_get - amount of coinToBuy
 * @property {number|string} commission - amount of coinToSell to pay fee
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<EstimateSellResult>)}
 */
export default function EstimateCoinSell(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {Object} params
     * @param {number|string} [params.coinIdToSell] - ID of the coin to sell
     * @param {string} [params.coinToSell] - symbol of the coin to sell
     * @param {string|number} [params.valueToSell]
     * @param {number|string} [params.coinIdToBuy] - ID of the coin to buy
     * @param {string} [params.coinToBuy] - symbol of the coin to buy
     * @param {ESTIMATE_SWAP_TYPE} [params.swapFrom] - estimate pool swap
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<EstimateSellResult>}
     */
    return function estimateCoinSell(params, axiosOptions) {
        if (!params.coinToSell && (!params.coinIdToSell && params.coinIdToSell !== 0)) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }
        if (!params.valueToSell) {
            return Promise.reject(new Error('Value to sell not specified'));
        }
        if (!params.coinToBuy && (!params.coinIdToBuy && params.coinIdToBuy !== 0)) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }

        params = {
            coin_id_to_sell: params.coinIdToSell,
            coin_to_sell: params.coinToSell,
            value_to_sell: convertToPip(params.valueToSell),
            coin_id_to_buy: params.coinIdToBuy,
            coin_to_buy: params.coinToBuy,
            swap_from: params.swapFrom,
        };

        return apiInstance.get('estimate_coin_sell', {...axiosOptions, params})
            .then((response) => {
                const resData = response.data;
                // receive pips from node and convert them
                return {
                    will_get: convertFromPip(resData.will_get),
                    commission: convertFromPip(resData.commission),
                };
            });
    };
}
