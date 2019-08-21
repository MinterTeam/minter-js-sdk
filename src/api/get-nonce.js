import {API_TYPE_GATE} from '../variables';
import {getData} from './utils';


/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(*): (Promise<number>)}
 * @constructor
 */
export default function GetNonce(apiInstance) {
    /**
     * Get nonce for new transaction: last transaction number + 1
     * @param {string} address
     * @return {Promise<number>}
     */
    return function getNonce(address) {
        const nonceUrl = apiInstance.defaults.apiType === API_TYPE_GATE
            ? `nonce/${address}`
            : `address?address=${address}`;

        return apiInstance.get(nonceUrl)
            .then((response) => {
                const resData = getData(response, apiInstance.defaults.apiType);
                const nonce = apiInstance.defaults.apiType === API_TYPE_GATE ? resData.nonce : resData.transaction_count;
                return Number(nonce) + 1;
            });
    };
}
