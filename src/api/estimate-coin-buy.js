import {convertFromPip, convertToPip} from 'minterjs-util';
// import {convertFromPip, convertToPip} from 'minterjs-util/src/converter.js';

/**
 * @typedef {Object} EstimateBuyResult
 * @property {number|string} will_pay - amount of coinToSell
 * @property {number|string} commission - amount of coinToSell to pay fee
 */

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<EstimateBuyResult>)}
 */
export default function EstimateCoinBuy(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {Object} params
     * @param {number|string} [params.coinIdToBuy] - ID of the coin to buy
     * @param {string} [params.coinToBuy] - symbol of the coin to buy
     * @param {string|number} params.valueToBuy
     * @param {number|string} [params.coinIdToSell] - ID of the coin to sell
     * @param {string} [params.coinToSell] - symbol of the coin to sell
     * @param {boolean} [params.fromPool] - estimate pool swap
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<EstimateBuyResult>}
     */
    return function estimateCoinBuy(params, axiosOptions) {
        if (!params.coinToBuy && (!params.coinIdToBuy && params.coinIdToBuy !== 0)) {
            return Promise.reject(new Error('Coin to buy not specified'));
        }
        if (!params.valueToBuy) {
            return Promise.reject(new Error('Value to buy not specified'));
        }
        if (!params.coinToSell && (!params.coinIdToSell && params.coinIdToSell !== 0)) {
            return Promise.reject(new Error('Coin to sell not specified'));
        }

        params = {
            coin_id_to_buy: params.coinIdToBuy,
            coin_to_buy: params.coinToBuy,
            value_to_buy: convertToPip(params.valueToBuy),
            coin_id_to_sell: params.coinIdToSell,
            coin_to_sell: params.coinToSell,
            from_pool: params.fromPool,
        };

        return apiInstance.get('estimate_coin_buy', {...axiosOptions, params})
            .then((response) => {
                const resData = response.data;
                // convert pips
                return {
                    will_pay: convertFromPip(resData.will_pay),
                    commission: convertFromPip(resData.commission),
                };
            });
    };
}
