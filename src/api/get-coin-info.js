/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<CoinInfo>)}
 */
export default function GetCoinInfo(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string} coinSymbol
     * @return {Promise<CoinInfo>}
     */
    return function getCoinInfo(coinSymbol) {
        return apiInstance.get(`coin_info/${coinSymbol}`)
            .then((response) => response.data);
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
 * @property {string} owner_address
 */
