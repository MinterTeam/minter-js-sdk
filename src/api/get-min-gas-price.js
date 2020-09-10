import {API_TYPE_GATE} from '../variables.js';
import {getData} from './utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<number>)}
 */
export default function GetMinGasPrice(apiInstance) {
    /**
     * Get current minimal gas price
     * @return {Promise<number>}
     */
    return function getMinGasPrice() {
        return apiInstance.get('min_gas_price')
            .then((response) => {
                const resData = response.data;
                const minGasPrice = resData.min_gas_price;
                return Number(minGasPrice);
            });
    };
}
