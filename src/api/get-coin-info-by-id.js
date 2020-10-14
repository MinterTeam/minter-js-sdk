/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<CoinInfo>)}
 */
export default function GetCoinInfoById(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {number|string} coinId
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<CoinInfo>}
     */
    return function getCoinInfoById(coinId, axiosOptions) {
        return apiInstance.get(`coin_info_by_id/${coinId}`, axiosOptions)
            .then((response) => {
                response.data.id = Number(response.data.id);
                return response.data;
            });
    };
}
