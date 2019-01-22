import axios from 'axios';
import createError from 'axios/lib/core/createError';
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
    if (options.apiType === API_TYPE_EXPLORER) {
        // explorer may response with 200 status and empty data, reject it
        options.adapter = nodeAdapter;
    }
    if (options.apiType === API_TYPE_NODE) {
        options.adapter = nodeAdapter;
    }

    // ensure `options.transformResponse` is array
    if (!Array.isArray(options.transformResponse)) {
        options.transformResponse = options.transformResponse ? [options.transformResponse] : [];
    }

    // transform response from explorer to minter-node api format
    if (options.apiType === API_TYPE_EXPLORER) {
        options.transformResponse.push((data) => {
            data = parseData(data);
            // transform `then`
            // `data: {data: {}}` to `data: {result: {}}`
            if (data.data) {
                data.result = data.data;
            }

            return data;
        });
    }

    // transform new node api to old node api format
    if (options.apiType === API_TYPE_NODE) {
        options.transformResponse.push((data) => {
            data = parseData(data);
            // transform `result` to `error` if its failed
            if (data.result && data.result.log) {
                data.error = data.result;
            }
            // ensure, that error.log exists
            if (data.error && data.error.message) {
                data.error.log = data.error.message;
            }

            return data;
        });
    }

    return axios.create(options);
}


function nodeAdapter(config) {
    const adapter = (nodeAdapter !== config.adapter && config.adapter) || axios.defaults.adapter;

    return new Promise((resolve, reject) => {
        adapter(config)
            .then((response) => {
                response.data = parseData(response.data);
                if (response.data.error || (response.data.result && response.data.result.log)) {
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

function parseData(data) {
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
    return data;
}
