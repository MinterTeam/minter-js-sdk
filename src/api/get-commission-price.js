/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {function(AxiosRequestConfig=): Promise<CommissionPriceData>}
 */
export default function GetCommissionPrice(apiInstance, factoryAxiosOptions) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<CommissionPriceData>}
     */
    return function getCommissionPrice(axiosOptions) {
        return apiInstance.get('price_commissions', {
            ...factoryAxiosOptions,
            ...axiosOptions,
        })
            .then((response) => {
                return response.data;
            });
    };
}
