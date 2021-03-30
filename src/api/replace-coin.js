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
 * @param apiInstance
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
 * @param apiInstance
 * @return {function(symbol: string|Array<string>, chainId: number=, axiosOptions: AxiosRequestConfig=): Promise<Object>}
 */
export function GetCoinId(apiInstance) {
    return getCoinId;

    /**
     * @param {string|Array<string>} symbol
     * @param {number} [chainId]
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<Object>}
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
    if (txType === TX_TYPE.SEND || txType === TX_TYPE.DECLARE_CANDIDACY || txType === TX_TYPE.DELEGATE || txType === TX_TYPE.UNBOND || txType === TX_TYPE.MOVE_STAKE || txType === TX_TYPE.MINT_TOKEN || txType === TX_TYPE.BURN_TOKEN || txType === TX_TYPE.VOTE_COMMISSION) {
        pathList.push('data.coin');
    } else if (txType === TX_TYPE.SELL || txType === TX_TYPE.SELL_ALL || txType === TX_TYPE.BUY) {
        pathList.push('data.coinToSell', 'data.coinToBuy');
    } else if (txType === TX_TYPE.CREATE_SWAP_POOL || txType === TX_TYPE.ADD_LIQUIDITY || txType === TX_TYPE.REMOVE_LIQUIDITY) {
        pathList.push('data.coin0', 'data.coin1');
    } else if (txType === TX_TYPE.MULTISEND) {
        txParams.data.list.forEach((item, index) => {
            pathList.push(`data.list[${index}].coin`);
        });
    } else if (txType === TX_TYPE.BUY_SWAP_POOL || txType === TX_TYPE.SELL_SWAP_POOL || txType === TX_TYPE.SELL_ALL_SWAP_POOL) {
        txParams.data.coins.forEach((item, index) => {
            pathList.push(`data.coins[${index}]`);
        });
    }

    return pathList;
}
