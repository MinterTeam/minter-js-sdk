import {isCoinId, isCoinSymbol} from '../utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function((string|number), AxiosRequestConfig=): (Promise<CoinInfo>)}
 */
export default function GetCoinInfo(apiInstance) {
    return getCoinInfo;
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string|number} coin
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<CoinInfo>}
     */
    function getCoinInfo(coin, axiosOptions) {
        let coinInfoPromise;
        if (isCoinId(coin)) {
            coinInfoPromise = apiInstance.get(`coin_info_by_id/${coin}`, axiosOptions);
        } else if (isCoinSymbol(coin)) {
            coinInfoPromise = apiInstance.get(`coin_info/${coin}`, axiosOptions);
        } else {
            return Promise.reject(new Error('Invalid coin'));
        }
        return coinInfoPromise
            .then((response) => {
                response.data.id = Number(response.data.id);
                return response.data;
            });
    }
}

/**
 * @typedef {object} CoinInfo
 * @property {number|string} id
 * @property {string} name
 * @property {string} symbol
 * @property {number|string} volume
 * @property {number|string} crr
 * @property {number|string} reserve_balance
 * @property {number|string} max_supply
 * @property {string|null} owner_address
 */
