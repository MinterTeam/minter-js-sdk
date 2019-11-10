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
        return apiInstance.get('min_gas_price')
            .then((response) => {
                const minGasPrice = getData(response, apiInstance.defaults.apiType);
                return Number(minGasPrice);
            });
    };
}
