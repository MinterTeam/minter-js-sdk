/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<CommissionPriceData>)}
 */
export default function GetCommissionPrice(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {boolean} mapData
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<CommissionPriceData>}
     */
    return function getCommissionPrice(axiosOptions) {
        return apiInstance.get('price_commissions', axiosOptions)
            .then((response) => {
                return response.data;
            });
    };
}
