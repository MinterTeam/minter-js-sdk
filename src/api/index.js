import axios from 'axios';
import {API_TYPE_EXPLORER, API_TYPE_NODE} from '../variables';

/**
 * @typedef {AxiosInstance} MinterApiInstance
 * @property {string} defaults.apiType
 */

/**
 * @param {Object} [options]
 * @param {string} [options.apiType]
 * @param {string} [options.baseURL]
 * @return {MinterApiInstance|AxiosInstance}
 */
export default function MinterApi(options = {}) {
    if (!options.apiType && !options.baseURL) {
        options.apiType = API_TYPE_EXPLORER;
    }
    if (!options.apiType && options.baseURL) {
        options.apiType = API_TYPE_NODE;
    }
    if (options.apiType === API_TYPE_EXPLORER && !options.baseURL) {
        options.baseURL = 'https://testnet.explorer.minter.network';
    }
    // transform response from explorer to node api format
    if (options.apiType === API_TYPE_EXPLORER) {
        if (!Array.isArray(options.transformResponse)) {
            options.transformResponse = options.transformResponse ? [options.transformResponse] : [];
        }

        // normalize explorer answer to minter-node format
        options.transformResponse.push((data) => {
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log(e);
                    data = {
                        error: {
                            log: 'Invalid response',
                        },
                    };
                }
            }
            // transform `then`
            if (data.data) {
                data.result = data.data;
                delete data.data;
            }
            // transform `catch`
            if (data.error) {
                data = data.error;
            }
            return data;
        });
    }
    return axios.create(options);
}
