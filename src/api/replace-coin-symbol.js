import _get from 'lodash-es/get.js';
import _set from 'lodash-es/set.js';
import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import GetCoinInfo from './get-coin-info.js';
import {validateCoin} from '../utils.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(TxParams): (Promise<TxParams>)}
 */
export default function ReplaceCoinSymbol(apiInstance) {
    const replaceCoinSymbolByPath = ReplaceCoinSymbolByPath(apiInstance);
    /**
     * @param {TxParams} txParams
     * @return {Promise<TxParams>}
     */
    return function replaceCoinSymbol(txParams) {
        let pathList = [];
        pathList.push('gasCoin');

        const txType = normalizeTxType(txParams.type);
        if (txType === TX_TYPE.SEND || txType === TX_TYPE.DECLARE_CANDIDACY || txType === TX_TYPE.DELEGATE || txType === TX_TYPE.UNBOND) {
            pathList.push('data.coin');
        } else if (txType === TX_TYPE.SELL || txType === TX_TYPE.SELL_ALL || txType === TX_TYPE.BUY) {
            pathList.push('data.coinToSell');
            pathList.push('data.coinToBuy');
        } else if (txType === TX_TYPE.MULTISEND) {
            txParams.data.list.forEach((item, index) => {
                pathList.push(`data.list[${index}].coin`);
            });
        }

        return replaceCoinSymbolByPath(txParams, pathList);
    };
}

export function ReplaceCoinSymbolByPath(apiInstance) {
    const getCoinInfo = GetCoinInfo(apiInstance);
    /**
     * @param {TxParams} txParams
     * @param {Array<string>} pathList
     * @return {Promise<TxParams>}
     */
    return function replaceCoinSymbolByPath(txParams, pathList) {
        let promiseList = {};
        pathList.forEach((path) => fillPath(path));

        const promiseArray = Object.values(promiseList);
        return Promise.all(promiseArray).then(() => txParams);

        function fillPath(path) {
            const symbolValue = _get(txParams, path);
            if (isCoinSymbol(symbolValue)) {
                if (!promiseList[symbolValue]) {
                    // coinInfo promise may be used by multiple patchers
                    promiseList[symbolValue] = getCoinInfo(symbolValue);
                }
                // append txParams patcher
                promiseList[symbolValue] = promiseList[symbolValue]
                    .then((coinInfo) => {
                        _set(txParams, path, coinInfo.id);
                        return coinInfo;
                    });
            }
        }
    };
}



function isCoinSymbol(coin) {
    if (typeof coin !== 'string') {
        return false;
    }

    // hex prefixed
    if (coin.substring(0, 2) === '0x') {
        return false;
    }

    try {
        validateCoin(coin.split('-')[0]);
    } catch (e) {
        return false;
    }

    return true;
}
