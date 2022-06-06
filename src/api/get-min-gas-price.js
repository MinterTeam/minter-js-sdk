
/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @return {GetMinGasPriceInstance}
 */
export default function GetMinGasPrice(apiInstance, factoryAxiosOptions) {
    /**
     * Get current minimal gas price
     * @typedef {Function} GetMinGasPriceInstance
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number>}
     */
    return function getMinGasPrice(axiosOptions) {
        return apiInstance.get('min_gas_price', {
            ...factoryAxiosOptions,
            ...axiosOptions,
        })
            .then((response) => {
                const resData = response.data;
                const minGasPrice = resData.min_gas_price;
                return Number(minGasPrice);
            });
    };
}
