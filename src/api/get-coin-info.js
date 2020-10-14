/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<CoinInfo>)}
 */
export default function GetCoinInfo(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string} coinSymbol
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<CoinInfo>}
     */
    return function getCoinInfo(coinSymbol, axiosOptions) {
        return apiInstance.get(`coin_info/${coinSymbol}`, axiosOptions)
            .then((response) => {
                response.data.id = Number(response.data.id);
                return response.data;
            });
    };
}

/**
 * @typedef {Object} CoinInfo
 * @property {number|string} id
 * @property {string} name
 * @property {string} symbol
 * @property {number|string} volume
 * @property {number|string} crr
 * @property {number|string} reserve_balance
 * @property {number|string} max_supply
 * @property {string|null} owner_address
 */
