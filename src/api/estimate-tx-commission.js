
/**
 * @TODO accept txParams
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<string>)}
 */
export default function EstimateTxCommission(apiInstance) {
    /**
     * @param {string} tx
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number|string>}
     */
    return function estimateTxCommission(tx, axiosOptions) {
        if (!tx) {
            return Promise.reject(new Error('Transaction not specified'));
        }

        return apiInstance.get(`estimate_tx_commission/${tx}`, axiosOptions)
            .then((response) => {
                return response.data.commission;
            });
    };
}
