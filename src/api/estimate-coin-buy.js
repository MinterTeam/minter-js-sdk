import {convertFromPip, convertToPip} from 'minterjs-util';
// import {convertFromPip, convertToPip} from 'minterjs-util/src/converter.js';
import {isValidNumber} from '../utils.js';

/**
 * @typedef {Object} EstimateBuyResult
 * @property {number|string} will_pay - amount of coinToSell
 * @property {number|string} commission - amount of coinToSell to pay fee
 * @property {"pool"|"bancor"} swap_from
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
     * @param {ESTIMATE_SWAP_TYPE} [params.swapFrom] - estimate from pool, bancor or optimal
     * @param {Array<number>} [params.route]
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
            swap_from: params.swapFrom,
            route: params.route,
        };

        return apiInstance.get('estimate_coin_buy', {...axiosOptions, params})
            .then((response) => {
                const resData = response.data;
                if (!isValidNumber(resData.will_pay)) {
                    throw new Error('Invalid estimation data, `will_pay` not specified');
                }
                if (!isValidNumber(resData.commission)) {
                    throw new Error('Invalid estimation data, `commission` not specified');
                }
                // convert pips
                resData.will_pay = convertFromPip(resData.will_pay);
                resData.commission = convertFromPip(resData.commission);
                return resData;
            });
    };
}
