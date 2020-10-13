/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<CoinInfo>)}
 */
export default function GetCoinInfoById(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {number|string} coinId
     * @return {Promise<CoinInfo>}
     */
    return function getCoinInfoById(coinId) {
        return apiInstance.get(`coin_info_by_id/${coinId}`)
            .then((response) => {
                response.data.id = Number(response.data.id);
                return response.data;
            });
    };
}
