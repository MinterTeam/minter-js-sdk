import Big from 'big.js';
import {convertFromPip, convertToPip, FeePrice, TX_TYPE} from 'minterjs-util';
import GetCommissionPrice from './get-commission-price.js';
import GetPoolInfo from './get-pool-info.js';
import {GetCoinId} from './replace-coin.js';
import EstimateCoinBuy from './estimate-coin-buy.js';
import {prepareTx} from '../tx.js';
import {isCoinId, validateUint} from '../utils.js';

Big.RM = 2;

/**
 *
 * @param {MinterApiInstance} apiInstance
 * @return {function((TxParams|string), {direct?: boolean}=, AxiosRequestConfig=): (Promise<{commission: (number|string), baseCoinCommission: (number|string), priceCoinCommission: (number|string), commissionPriceData: CommissionPriceData}>|Promise<{commission: (number|string)}>)}
 */
export default function EstimateTxCommission(apiInstance) {
    const getCommissionPrice = GetCommissionPrice(apiInstance);
    const getPoolInfo = GetPoolInfo(apiInstance);
    const getCoinId = GetCoinId(apiInstance);
    const estimateCoinBuy = EstimateCoinBuy(apiInstance);

    return estimateTxCommission;

    /**
     * @param {TxParams|string} txParams
     * @param {Object} [options]
     * @param {boolean} [options.direct = true]
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<{commission: (number|string), baseCoinCommission: (number|string), priceCoinCommission: (number|string), commissionPriceData: CommissionPriceData}>|Promise<{commission: (number|string)}>}
     */
    function estimateTxCommission(txParams, {direct = true} = {}, axiosOptions) {
        let paramsPromise;
        if (typeof txParams === 'object') {
            paramsPromise = getCoinId(txParams.gasCoin || 0, txParams.chainId, axiosOptions)
                .then((coinId) => {
                    validateUint(coinId, 'gasCoin');
                    return {
                        ...txParams,
                        gasCoin: coinId,
                    };
                });
        } else {
            paramsPromise = Promise.resolve(txParams);
        }

        return paramsPromise
            .then((updatedTxParams) => {
                if (direct) {
                    return estimateFeeDirect(updatedTxParams, axiosOptions);
                } else {
                    return estimateFeeCalculate(updatedTxParams, axiosOptions);
                }
            });
    }

    /**
     * @param {string|TxParams} txParams
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<{commission: number|string}>}
     */
    function estimateFeeDirect(txParams, axiosOptions) {
        if (!txParams) {
            return Promise.reject(new Error('Transaction not specified'));
        }
        let tx;
        if (typeof txParams === 'string') {
            tx = txParams;
        } else {
            txParams = {
                chainId: 0,
                nonce: 0,
                gasPrice: 1,
                signatureType: 1,
                ...txParams,
            };
            tx = prepareTx(txParams).serializeToString();
        }

        return apiInstance.get(`estimate_tx_commission/${tx}`, axiosOptions)
            .then((response) => {
                response.data.commission = convertFromPip(response.data.commission);
                return response.data;
            });
    }

    /**
     * @param {TxParams} txParams
     * @param {AxiosRequestConfig} [axiosOptions]
     * @return {Promise<{commission: number|string, baseCoinCommission: number|string, priceCoinCommission: number|string, commissionPriceData: CommissionPriceData}>}
     */
    async function estimateFeeCalculate(txParams, axiosOptions) {
        if (!txParams || typeof txParams !== 'object') {
            return Promise.reject(new TypeError('Invalid txParams'));
        }

        const commissionPriceData = await getCommissionPrice(axiosOptions);

        // priceCoin
        const feePrice = new FeePrice(commissionPriceData);
        const priceCoinFee = feePrice.getFeeValue(txParams.type, getFeePriceOptionsFromTxParams(txParams));

        // baseCoin
        let baseCoinFee;
        if (isPriceCoinSameAsBaseCoin(commissionPriceData)) {
            baseCoinFee = priceCoinFee;
        } else {
            const priceCoinPool = await getPoolInfo(0, commissionPriceData.coin.id, axiosOptions);
            baseCoinFee = getBaseCoinAmountFromPool(priceCoinFee, priceCoinPool);
        }

        // gasCoin
        let fee;
        if (isGasCoinSameAsBaseCoin(txParams.gasCoin)) {
            fee = baseCoinFee;
        } else {
            const {amount} = await getEstimation(txParams.gasCoin, baseCoinFee, axiosOptions);
            fee = amount;
        }


        return {
            commission: fee,
            baseCoinCommission: baseCoinFee,
            priceCoinCommission: priceCoinFee,
            commissionPriceData,
        };
    }

    /**
     * @param {number|string} coinIdOrSymbol
     * @param {number|string} baseCoinAmount
     * @param {AxiosRequestConfig} axiosOptions
     * @return {Promise<{amount: string, baseCoinAmount: string}>}
     */
    function getEstimation(coinIdOrSymbol, baseCoinAmount, axiosOptions) {
        return estimateCoinBuy({
            coinToSell: !isCoinId(coinIdOrSymbol) ? coinIdOrSymbol : undefined,
            coinIdToSell: isCoinId(coinIdOrSymbol) ? coinIdOrSymbol : undefined,
            valueToBuy: baseCoinAmount,
            coinIdToBuy: 0,
            swapFrom: 'optimal',
        }, axiosOptions)
            .then((result) => {
                return {
                    amount: result.will_pay,
                    baseCoinAmount,
                };
            });
    }
}

/**
 * @param {CommissionPriceData} commissionPriceData
 * @return {boolean}
 */
function isPriceCoinSameAsBaseCoin(commissionPriceData) {
    return Number.parseInt(commissionPriceData?.coin.id, 10) === 0;
}

/**
 * @param {number|string} gasCoinId
 * @return {boolean}
 */
function isGasCoinSameAsBaseCoin(gasCoinId) {
    return Number.parseInt(gasCoinId, 10) === 0;
}


/**
 *
 * @param {number|string} priceCoinAmount
 * @param {PoolInfo} pool
 * @return {string|number}
 */
function getBaseCoinAmountFromPool(priceCoinAmount, pool) {
    // amount of base coin in pool
    const reserveBase = new Big(pool.amount0);
    // amount of price coin in pool
    const reservePrice = new Big(pool.amount1);
    // amount of price coin in pool
    const priceCoinAmountPip = new Big(convertToPip(priceCoinAmount));

    // @see https://github.com/MinterTeam/minter-go-node/blob/6e44d5691c9df1a9c725d0f52c5921e8523c7f18/coreV2/state/swap/swap.go#L642
    // reserveBase - (reservePrice * reserveBase) / (priceCoinAmount * 0.998 + reservePrice)
    let result = reserveBase.minus(reservePrice.times(reserveBase).div(priceCoinAmountPip.times(0.998).plus(reservePrice)));

    // received amount from pool rounds down, spent amount to poll rounds up
    // round down
    result = result.round(undefined, 0);

    return convertFromPip(result);
}

/**
 * @param {TxParams} txParams
 * @return FeePriceOptions
 */
function getFeePriceOptionsFromTxParams(txParams) {
    const txType = txParams.type;
    if (!txType) {
        throw new Error('Tx `type` not specified');
    }

    const isTickerType = txType === TX_TYPE.CREATE_COIN || txType === TX_TYPE.CREATE_TOKEN;
    const coinSymbol = isTickerType ? txParams.data?.symbol : undefined;
    if (isTickerType && !coinSymbol) {
        throw new Error('`symbol` not specified for ticker creation tx');
    }

    let deltaItemCount;
    if (txType === TX_TYPE.BUY_SWAP_POOL || txType === TX_TYPE.SELL_SWAP_POOL || txType === TX_TYPE.SELL_ALL_SWAP_POOL) {
        const coinCount = txParams.data?.coins.length;
        if (!coinCount) {
            throw new Error('Invalid `coins` field in swap pool tx');
        }
        // count of pools
        deltaItemCount = coinCount - 1;
    }
    if (txType === TX_TYPE.MULTISEND) {
        // count of recipients
        deltaItemCount = txParams.data?.list.length;
        if (!deltaItemCount) {
            throw new Error('Invalid `list` field in multisend tx');
        }
    }

    return {
        payload: txParams.payload,
        coinSymbol,
        deltaItemCount,
    };
}
