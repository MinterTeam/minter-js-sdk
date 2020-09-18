import _get from 'lodash-es/get.js';
import _set from 'lodash-es/set.js';
import {TX_TYPE, normalizeTxType} from 'minterjs-util';
import GetCoinInfo from './get-coin-info.js';

/**
 * @param {MinterApiInstance} apiInstance
 * @return {function(TxParams): (Promise<TxParams>)}
 */
export default function ReplaceCoinSymbol(apiInstance) {
    const getCoinInfo = GetCoinInfo(apiInstance);
    /**
     * @param {TxParams} txParams
     * @return {Promise<TxParams>}
     */
    return function replaceCoinSymbol(txParams) {
        let promiseList = {};
        fillPath('gasCoin');

        const txType = normalizeTxType(txParams.type);
        if (txType === TX_TYPE.SEND || txType === TX_TYPE.DECLARE_CANDIDACY || txType === TX_TYPE.DELEGATE || txType === TX_TYPE.UNBOND) {
            fillPath('data.coin');
        } else if (txType === TX_TYPE.SELL || txType === TX_TYPE.SELL_ALL || txType === TX_TYPE.BUY) {
            fillPath('data.coinToSell');
            fillPath('data.coinToBuy');
        } else if (txType === TX_TYPE.MULTISEND) {
            txParams.data.list.forEach((item, index) => {
                fillPath(`data.list[${index}].coin`);
            });
        }

        promiseList = Object.values(promiseList);
        return Promise.all(promiseList).then(() => txParams);

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

    // out of coin symbol length interval
    if (coin.length < 3 || (coin.length > 10 && coin.indexOf('-') === -1)) {
        return false;
    }

    return true;
}
