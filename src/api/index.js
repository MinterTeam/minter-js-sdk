import axios from 'axios';
// import createError from 'axios/lib/core/createError';
import {API_TYPE_NODE} from '../variables.js';

/**
 * @typedef {object} MinterApiInstanceType
 * @property {AxiosDefaults} defaults
 * @property {string} defaults.apiType
 *
 * @typedef {AxiosInstance | MinterApiInstanceType} MinterApiInstance
 */

/**
 * @param {object} [options]
 * @param {string} [options.apiType]
 * @param {number} [options.chainId]
 * @param {string} [options.baseURL]
 * @param {...import('axios').AxiosRequestConfig} [options.*]
 * @return {MinterApiInstance}
 */
export default function MinterApi(options = {}) {
    if (!options.apiType) {
        options.apiType = API_TYPE_NODE;
    }

    // ensure error payload will be rejected
    // options.adapter = thenableToRejectedAdapter;

    // ensure `options.transformResponse` is array
    if (!Array.isArray(options.transformResponse)) {
        options.transformResponse = options.transformResponse ? [options.transformResponse] : [];
    }

    // @TODO duplication with getData
    // transform response from gate to minter-node api format
    // if (options.apiType === API_TYPE_GATE) {
    //     options.transformResponse.push((data) => {
    //         data = parseData(data);
    //         // transform `then`
    //         // `data: {data: {}}` to `data: {result: {}}`
    //         // if (data.data) {
    //         //     data.result = data.data;
    //         // }
    //
    //         return data;
    //     });
    // }

    // ensure, that error.message exists
    options.transformResponse.push((data) => {
        data = parseData(data);
        if (data?.error?.details) {
            data.error.data = data.error.details;
        }
        // transform `result` to `error` if its failed
        // if (data.result && data.result.log) {
        //     data.error = data.result;
        // }
        // rename error.log
        // if (data.error && data.error.log && !data.error.message) {
        //     data.error.message = data.error.log;
        // }
        // rename error.tx_result.log
        // if (data.error && data.error.tx_result && data.error.tx_result.log && !data.error.tx_result.message) {
        //     data.error.tx_result.message = data.error.tx_result.log;
        // }

        return data;
    });

    const instance = axios.create(options);
    instance.defaults.apiType = options.apiType;
    instance.defaults.chainId = options.chainId;
    // ensure trailing slash on baseURL
    instance.interceptors.request.use((config) => {
        if (config.baseURL[config.baseURL.length - 1] !== '/') {
            config.baseURL += '/';
        }
        return config;
    });


    return instance;
}


// transform thenable response with error payload into rejected
/*
function thenableToRejectedAdapter(config) {
    const adapter = (thenableToRejectedAdapter !== config.adapter && config.adapter) || axios.defaults.adapter;

    return new Promise((resolve, reject) => {
        adapter(config)
            .then((response) => {
                response.data = parseData(response.data);
                if (response.data.error || (response.data.result && response.data.result.message)) {
                    reject(createError(
                        `Request failed with status code ${response.status}`,
                        response.config,
                        null,
                        response.request,
                        response,
                    ));
                }

                resolve(response);
            })
            .catch(reject);
    });
}
*/

/**
 * @param {string|any} data
 */
function parseData(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            // eslint-disable-next-line no-console
            console.log(data);
            data = {
                error: {
                    message: 'Invalid response: failed to parse JSON data. Looks like request URL is invalid.',
                },
            };
        }
    }
    return data;
}
