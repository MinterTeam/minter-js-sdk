import _get from 'lodash-es/get.js';
import _set from 'lodash-es/set.js';
import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import GetCoinInfo from './get-coin-info.js';
import {getBaseCoinSymbol, isBaseCoinSymbol, isCoinId, isCoinSymbol} from '../utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(TxParams): (Promise<TxParams>)}
 */
export function ReplaceCoinSymbol(apiInstance) {
    const replaceCoinSymbolByPath = ReplaceCoinSymbolByPath(apiInstance);
    /**
     * @param {TxParams} txParams
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<TxParams>}
     */
    return function replaceCoinSymbol(txParams, axiosOptions) {
        const pathList = getTxParamsPathList(txParams);

        return replaceCoinSymbolByPath(txParams, pathList, txParams.chainId, axiosOptions);
    };
}

/**
 *
 * @param {MinterApiInstance} apiInstance
 * @return {function(Object, Array<string>, number=, AxiosRequestConfig=): Promise<Object>}
 * @constructor
 */
export function ReplaceCoinSymbolByPath(apiInstance) {
    const replaceParamsByPath = ReplaceParamsByPath(apiInstance);
    return replaceCoinSymbolByPath;
    /**
     * @param {Object} txParams
     * @param {Array<string>} pathList
     * @param {number} [chainId]
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<Object>}
     */
    function replaceCoinSymbolByPath(txParams, pathList, chainId = apiInstance.defaults.chainId, axiosOptions = undefined) {
        return replaceParamsByPath(txParams, pathList, replacer, chainId, axiosOptions);

        // eslint-disable-next-line no-shadow, unicorn/consistent-function-scoping
        function replacer(symbolValue, chainId, apiInstance, axiosOptions) {
            if (isCoinSymbol(symbolValue)) {
                return _getCoinId(symbolValue, chainId, apiInstance, axiosOptions);
            } else {
                return Promise.resolve(symbolValue);
            }
        }
    }
}

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(txParams: Object, pathList: Array<string>, replacer: function, chainId: number=, AxiosRequestConfig=): Promise<Object>}
 * @constructor
 */
export function ReplaceParamsByPath(apiInstance) {
    return replaceParamsByPath;
    /**
     * @param {Object} txParams
     * @param {Array<string>} pathList
     * @param {function(inputValue: any, number=, AxiosRequestConfig=): Promise} replacer
     * @param {number} [chainId]
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<Object>}
     */
    function replaceParamsByPath(txParams, pathList, replacer, chainId = apiInstance.defaults.chainId, axiosOptions = undefined) {
        let promiseList = {};
        pathList.forEach((path) => fillPath(path));

        const promiseArray = Object.values(promiseList);
        return Promise.all(promiseArray).then(() => txParams);

        /**
         * Fill promiseList by path and replace txParams value by path
         * @param {string} path
         */
        function fillPath(path) {
            const inputValue = _get(txParams, path);
            // coinInfo promise may be used by multiple patchers
            if (!promiseList[inputValue]) {
                promiseList[inputValue] = replacer(inputValue, chainId, apiInstance, axiosOptions);
            }
            // append txParams patcher
            promiseList[inputValue] = promiseList[inputValue]
                .then((outputValue) => {
                    _set(txParams, path, outputValue);
                    return outputValue;
                });
        }
    }
}

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(symbol: string|Array<string>, chainId: number=, axiosOptions: AxiosRequestConfig=): Promise<number>}
 */
export function GetCoinId(apiInstance) {
    return getCoinId;

    /**
     * @param {string|Array<string>} symbol
     * @param {number} [chainId]
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number|Array<number>>}
     */
    function getCoinId(symbol, chainId = apiInstance.defaults.chainId, axiosOptions = undefined) {
        return processArrayByPromise(_getCoinId, symbol, chainId, apiInstance, axiosOptions);
    }
}

/**
 * @template T
 * @param {function(value, ...otherArgs): Promise<T>} fn
 * @param {*|Array<*>} value
 * @param {...Object} otherArgs
 * @return {Promise<T|Array<T>>}
 */
function processArrayByPromise(fn, value, ...otherArgs) {
    if (Array.isArray(value)) {
        const valueList = value;
        const promiseList = valueList.map((valueItem) => fn(valueItem, ...otherArgs));
        return Promise.all(promiseList);
    } else {
        return fn(value, ...otherArgs);
    }
}

/**
 * @param {string} symbol
 * @param {number} [chainId]
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [axiosOptions]
 * @return {Promise<number>}
 * @private
 */
function _getCoinId(symbol, chainId, apiInstance, axiosOptions) {
    if (isCoinId(symbol)) {
        return Promise.resolve(symbol);
    }
    if (isCoinSymbol(symbol)) {
        if (isBaseCoinSymbol(chainId, symbol)) {
            return Promise.resolve(0);
        } else {
            const getCoinInfo = GetCoinInfo(apiInstance);
            return getCoinInfo(symbol, axiosOptions)
                .then((coinInfo) => coinInfo.id);
        }
    } else {
        return Promise.reject(new Error('Invalid coin symbol'));
    }
}

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(TxParams): (Promise<TxParams>)}
 */
export function ReplaceCoinId(apiInstance) {
    const replaceCoinIdByPath = ReplaceCoinIdByPath(apiInstance);
    /**
     * @param {TxParams} txParams
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<TxParams>}
     */
    return function replaceCoinId(txParams, axiosOptions) {
        const pathList = getTxParamsPathList(txParams);

        return replaceCoinIdByPath(txParams, pathList, txParams.chainId, axiosOptions);
    };
}

/**
 *
 * @param {MinterApiInstance} apiInstance
 * @return {function(Object, Array<string>, number=, AxiosRequestConfig=): Promise<Object>}
 * @constructor
 */
export function ReplaceCoinIdByPath(apiInstance) {
    const replaceParamsByPath = ReplaceParamsByPath(apiInstance);
    return replaceCoinIdByPath;
    /**
     * @param {Object} txParams
     * @param {Array<string>} pathList
     * @param {number} [chainId]
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<Object>}
     */
    function replaceCoinIdByPath(txParams, pathList, chainId = apiInstance.defaults.chainId, axiosOptions = undefined) {
        return replaceParamsByPath(txParams, pathList, replacer, chainId, axiosOptions);

        // eslint-disable-next-line no-shadow, unicorn/consistent-function-scoping
        function replacer(idValue, chainId, apiInstance, axiosOptions) {
            if (isCoinId(idValue)) {
                return _getCoinSymbol(idValue, chainId, apiInstance, axiosOptions);
            } else {
                return Promise.resolve(idValue);
            }
        }
    }
}

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(id: number|string|Array<number|string>, chainId: number=, axiosOptions: AxiosRequestConfig=): Promise<number>}
 */
export function GetCoinSymbol(apiInstance) {
    return getCoinSymbol;

    /**
     * @param {number|string|Array<number|string>} id
     * @param {number} [chainId]
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<string|Array<string>>}
     */
    function getCoinSymbol(id, chainId = apiInstance.defaults.chainId, axiosOptions = undefined) {
        return processArrayByPromise(_getCoinSymbol, id, chainId, apiInstance, axiosOptions);
    }
}

/**
 * @param {number|string} id
 * @param {number} [chainId]
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [axiosOptions]
 * @return {Promise<string>}
 * @private
 */
function _getCoinSymbol(id, chainId, apiInstance, axiosOptions) {
    if (isCoinSymbol(id)) {
        return Promise.resolve(id);
    }
    if (isCoinId(id)) {
        if (Number.parseInt(id, 10) === 0 && chainId) {
            return Promise.resolve(getBaseCoinSymbol(chainId));
        } else {
            const getCoinInfo = GetCoinInfo(apiInstance);
            return getCoinInfo(id, axiosOptions)
                .then((coinInfo) => coinInfo.symbol);
        }
    } else {
        return Promise.reject(new Error('Invalid coin id'));
    }
}

/**
 * @param {TxParams} txParams
 * @return {Array<string>}
 */
function getTxParamsPathList(txParams) {
    let pathList = [];
    pathList.push('gasCoin');

    const txType = normalizeTxType(txParams.type);
    switch (txType) {
        case TX_TYPE.SEND:
        case TX_TYPE.DECLARE_CANDIDACY:
        case TX_TYPE.DELEGATE:
        case TX_TYPE.UNBOND:
        case TX_TYPE.MOVE_STAKE:
        case TX_TYPE.MINT_TOKEN:
        case TX_TYPE.BURN_TOKEN:
        case TX_TYPE.LOCK:
        case TX_TYPE.VOTE_COMMISSION: {
            pathList.push('data.coin');
            break;
        }
        case TX_TYPE.ADD_LIMIT_ORDER:
        case TX_TYPE.SELL:
        case TX_TYPE.SELL_ALL:
        case TX_TYPE.BUY: {
            pathList.push('data.coinToSell', 'data.coinToBuy');
            break;
        }
        case TX_TYPE.CREATE_SWAP_POOL:
        case TX_TYPE.ADD_LIQUIDITY:
        case TX_TYPE.REMOVE_LIQUIDITY: {
            pathList.push('data.coin0', 'data.coin1');
            break;
        }
        case TX_TYPE.MULTISEND: {
            txParams.data.list.forEach((item, index) => {
                pathList.push(`data.list[${index}].coin`);
            });
            break;
        }
        case TX_TYPE.BUY_SWAP_POOL:
        case TX_TYPE.SELL_SWAP_POOL:
        case TX_TYPE.SELL_ALL_SWAP_POOL: {
            txParams.data.coins.forEach((item, index) => {
                pathList.push(`data.coins[${index}]`);
            });
            break;
        }
        // No default
        default:
    }

    return pathList;
}
