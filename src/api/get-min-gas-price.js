import {API_TYPE_GATE} from '../variables';
import {getData} from './utils';

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
                const minGasPrice = getData(response, apiInstance.defaults.apiType);
                return Number(minGasPrice);
            });
    };
}
