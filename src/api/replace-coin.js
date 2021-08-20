import _get from 'lodash-es/get.js';
import _set from 'lodash-es/set.js';
import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import GetCoinInfo from './get-coin-info.js';
import {isBaseCoinSymbol, isCoinId, isCoinSymbol} from '../utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(TxParams): (Promise<TxParams>)}
 */
export function ReplaceCoinSymbol(apiInstance) {
    const replaceCoinSymbolByPath = ReplaceCoinSymbolByPath(apiInstance);
    /**
     * @param {TxParams} txParams
     * @param {AxiosRequestConfig} [axiosOptions]
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
    return replaceCoinSymbolByPath;
    /**
     * @param {Object} txParams
     * @param {Array<string>} pathList
     * @param {number} [chainId]
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<Object>}
     */
    function replaceCoinSymbolByPath(txParams, pathList, chainId = apiInstance.defaults.chainId, axiosOptions) {
        let promiseList = {};
        pathList.forEach((path) => fillPath(path));

        const promiseArray = Object.values(promiseList);
        return Promise.all(promiseArray).then(() => txParams);

        /**
         * Fill promiseList by path and replace txParams value by path
         * @param {string} path
         */
        function fillPath(path) {
            const symbolValue = _get(txParams, path);
            if (isCoinSymbol(symbolValue)) {
                // coinInfo promise may be used by multiple patchers
                if (!promiseList[symbolValue]) {
                    promiseList[symbolValue] = _getCoinId(symbolValue, chainId, apiInstance, axiosOptions);
                }
                // append txParams patcher
                promiseList[symbolValue] = promiseList[symbolValue]
                    .then((coinId) => {
                        _set(txParams, path, coinId);
                        return coinId;
                    });
            }
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
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<number|Array<number>>}
     */
    function getCoinId(symbol, chainId = apiInstance.defaults.chainId, axiosOptions) {
        if (Array.isArray(symbol)) {
            const symbolList = symbol;
            const promiseList = symbolList.map((symbolValue) => _getCoinId(symbolValue, chainId, apiInstance, axiosOptions));
            return Promise.all(promiseList);
        } else {
            return _getCoinId(symbol, chainId, apiInstance, axiosOptions);
        }
    }
}

/**
 * @param {string} symbol
 * @param {number} [chainId]
 * @param {MinterApiInstance} apiInstance
 * @param {AxiosRequestConfig} [axiosOptions]
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
