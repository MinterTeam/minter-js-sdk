import {API_TYPE_GATE} from '../variables.js';
import {getData} from './utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<number>)}
 * @constructor
 */
export default function GetMinGasPrice(apiInstance) {
    /**
     * Get current minimal gas price
     * @return {Promise<number>}
     */
    return function getMinGasPrice() {
        const minGasPriceUrl = apiInstance.defaults.apiType === API_TYPE_GATE
            ? 'min-gas'
            : 'min_gas_price';

        return apiInstance.get(minGasPriceUrl)
            .then((response) => {
                const resData = getData(response, apiInstance.defaults.apiType);
                const minGasPrice = apiInstance.defaults.apiType === API_TYPE_GATE ? resData.gas : resData;
                return Number(minGasPrice);
            });
    };
}
