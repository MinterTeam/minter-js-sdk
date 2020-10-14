
/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<number>)}
 */
export default function GetMinGasPrice(apiInstance) {
    /**
     * Get current minimal gas price
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number>}
     */
    return function getMinGasPrice(axiosOptions) {
        return apiInstance.get('min_gas_price', axiosOptions)
            .then((response) => {
                const resData = response.data;
                const minGasPrice = resData.min_gas_price;
                return Number(minGasPrice);
            });
    };
}
