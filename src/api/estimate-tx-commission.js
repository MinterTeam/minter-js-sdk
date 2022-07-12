import Big from 'big.js';
import {convertFromPip, convertToPip, FeePrice, TX_TYPE} from 'minterjs-util';
import GetCommissionPrice from './get-commission-price.js';
import GetPoolInfo from './get-pool-info.js';
import {GetCoinId, ReplaceCoinSymbol} from './replace-coin.js';
import {fillDefaultData} from '../tx-data/index.js';
import {prepareTx} from '../tx.js';
import {isCoinId, validateUint} from '../utils.js';

Big.RM = 2;

/**
 * @enum {string}
 */
export const FEE_PRECISION_SETTING = {
    // value may be precise, imprecise, or even omitted
    AUTO: 'auto',
    // precise value is required
    PRECISE: 'precise',
    // some value is required but it can be imprecise
    IMPRECISE: 'imprecise',
    OMIT: 'omit',
};
const PRECISION = FEE_PRECISION_SETTING;

/**
 * @param {MinterApiInstance} apiInstance
 * @param {import('axios').AxiosRequestConfig} [factoryAxiosOptions]
 * @param {import('axios').AxiosRequestConfig} [factoryExtraAxiosOptions]
 * @return {EstimateTxCommissionInstance}
 */
export default function EstimateTxCommission(apiInstance, factoryAxiosOptions, factoryExtraAxiosOptions) {
    const getCommissionPrice = GetCommissionPrice(apiInstance, factoryExtraAxiosOptions);
    const getPoolInfo = GetPoolInfo(apiInstance, factoryExtraAxiosOptions);
    const getCoinId = GetCoinId(apiInstance, factoryExtraAxiosOptions);
    const replaceCoinSymbol = ReplaceCoinSymbol(apiInstance, factoryExtraAxiosOptions);

    /**
     * @typedef {MinterFeeEstimationDirect|MinterFeeEstimationCalculate} MinterFeeEstimation
     */
    /**
     * @typedef {Function} EstimateTxCommissionInstance
     * @param {TxParams|string} txParams
     * @param {object} [options]
     * @param {FEE_PRECISION_SETTING} [options.needGasCoinFee]
     * @param {FEE_PRECISION_SETTING} [options.needBaseCoinFee]
     * @param {FEE_PRECISION_SETTING} [options.needPriceCoinFee]
     * @param {boolean} [options.loose] - DEPRECATED
     * @param {boolean} [options.direct] - DEPRECATED
     * @param {import('axios').AxiosRequestConfig} [axiosOptions] - for main request (estimation)
     * @param {import('axios').AxiosRequestConfig} [extraAxiosOptions] - for secondary requests (commission price data, coin IDs, and pool info)
     * @return {Promise<MinterFeeEstimation>}
     */
    return function estimateTxCommission(txParams, {
        needGasCoinFee = PRECISION.AUTO,
        needBaseCoinFee = PRECISION.AUTO,
        needPriceCoinFee = PRECISION.AUTO,
        loose,
        direct,
    } = {}, axiosOptions = undefined, extraAxiosOptions = undefined) {
        axiosOptions = {
            ...factoryAxiosOptions,
            ...axiosOptions,
        };
        if (typeof direct !== 'undefined') {
            // eslint-disable-next-line no-console
            console.warn('`direct` option in `estimateTxCommission` is deprecated, use `needGasCoinFee`, `needBaseCoinFee`, and `needPriceCoinFee` options instead');
            needGasCoinFee = direct ? PRECISION.PRECISE : PRECISION.IMPRECISE;
            needBaseCoinFee = direct ? PRECISION.OMIT : PRECISION.IMPRECISE;
            needPriceCoinFee = direct ? PRECISION.OMIT : PRECISION.PRECISE;
        }
        if (typeof loose !== 'undefined') {
            // eslint-disable-next-line no-console
            console.warn('`loose` option in `estimateTxCommission` is deprecated, use `needGasCoinFee`, `needBaseCoinFee`, and `needPriceCoinFee` options instead');
            needGasCoinFee = !loose ? PRECISION.PRECISE : PRECISION.IMPRECISE;
            needBaseCoinFee = !loose ? PRECISION.OMIT : PRECISION.IMPRECISE;
            needPriceCoinFee = !loose ? PRECISION.OMIT : PRECISION.PRECISE;
        }

        let paramsPromise;
        if (typeof txParams === 'object') {
            /*
            if (loose) {
                paramsPromise = getCoinId(txParams.gasCoin || 0, txParams.chainId, extraAxiosOptions)
                    .then((coinId) => {
                        validateUint(coinId, 'gasCoin');
                        return {
                            ...txParams,
                            gasCoin: coinId,
                        };
                    });
            } else {
            */
            // @TODO some fields of tx data can dropped, because they don't affect fee, it will reduce coin id requests and make estimation requests more cacheable
            paramsPromise = replaceCoinSymbol(txParams, extraAxiosOptions);
            // }
        } else {
            paramsPromise = Promise.resolve(txParams);
        }

        return paramsPromise
            .then((updatedTxParams) => {
                if (typeof updatedTxParams !== 'object') {
                    return estimateFeeDirect(updatedTxParams, axiosOptions);
                } else {
                    return estimateFeeCalculate(updatedTxParams, {needGasCoinFee, needBaseCoinFee, needPriceCoinFee, axiosOptions, extraAxiosOptions});
                }
            });
    };

    /**
     * @typedef {{commission: number|string}} MinterFeeEstimationDirect
     */
    /**
     * @param {string|TxParams} txParams
     * @param {import('axios').AxiosRequestConfig} [axiosOptions]
     * @return {Promise<MinterFeeEstimationDirect>}
     */
    function estimateFeeDirect(txParams, axiosOptions) {
        if (!txParams) {
            return Promise.reject(new Error('Transaction not specified'));
        }
        let tx;
        if (typeof txParams === 'string') {
            tx = txParams;
        } else {
            tx = prepareTx({
                ...txParams,
                data: fillDefaultData(txParams.type, txParams.data),
            }, {
                disableValidation: true,
                disableDecorationParams: true,
            }).serializeToString();
        }

        return apiInstance.get(`estimate_tx_commission/${tx}`, axiosOptions)
            .then((response) => {
                return {
                    commission: convertFromPip(response.data.commission),
                };
            });
    }

    /**
     * @typedef {MinterFeeEstimationDirect&{baseCoinCommission: number|string, priceCoinCommission: number|string, commissionPriceData: CommissionPriceData}} MinterFeeEstimationCalculate
     */
    /**
     * @param {TxParams} txParams
     * @param {object} [options]
     * @param {FEE_PRECISION_SETTING} [options.needGasCoinFee]
     * @param {FEE_PRECISION_SETTING} [options.needBaseCoinFee]
     * @param {FEE_PRECISION_SETTING} [options.needPriceCoinFee]
     * @param {import('axios').AxiosRequestConfig} [options.axiosOptions]
     * @param {import('axios').AxiosRequestConfig} [options.extraAxiosOptions] - applied to secondary requests
     * @return {Promise<MinterFeeEstimationCalculate>}
     */
    async function estimateFeeCalculate(txParams, {needGasCoinFee, needBaseCoinFee, needPriceCoinFee, axiosOptions, extraAxiosOptions}) {
        if (!txParams || typeof txParams !== 'object') {
            throw new TypeError('Invalid txParams');
        }

        if (needPriceCoinFee === PRECISION.AUTO) {
            needPriceCoinFee = PRECISION.OMIT;
        }
        if (needBaseCoinFee === PRECISION.AUTO) {
            needBaseCoinFee = PRECISION.OMIT;
        }
        if (needGasCoinFee === PRECISION.AUTO) {
            needGasCoinFee = PRECISION.PRECISE;
        }

        const commissionPriceData = needPriceCoinFee !== PRECISION.OMIT ? await getCommissionPrice(extraAxiosOptions) : undefined;

        // coins may be same only if they both defined
        const sameGasAndBaseCoins = isGasCoinSameAsBaseCoin(txParams.gasCoin);
        const sameGasAndPriceCoins = isGasCoinSameAsPriceCoin(txParams.gasCoin, commissionPriceData);
        const samePriceAndBaseCoins = isPriceCoinSameAsBaseCoin(commissionPriceData);
        const gasDependsOnBase = sameGasAndBaseCoins && needGasCoinFee === PRECISION.IMPRECISE && needBaseCoinFee === PRECISION.IMPRECISE && commissionPriceData;
        const baseDependsOnGas = sameGasAndBaseCoins && needGasCoinFee === PRECISION.PRECISE;

        // priceCoin
        const priceCoinFee = (() => {
            // OMIT
            if (!commissionPriceData) {
                return undefined;
            }
            // PRECISE
            const feePrice = new FeePrice(commissionPriceData);
            return feePrice.getFeeValue(txParams.type, getFeePriceOptionsFromTxParams(txParams, true));
        })();

        // baseCoin
        let baseCoinFee = await (async () => {
            // PRECISE
            if (samePriceAndBaseCoins) {
                return priceCoinFee;
            }
            if (baseDependsOnGas) {
                // depends on gasCoinFee, will be updated later
                return undefined;
            }
            // OMIT
            if (needBaseCoinFee === PRECISION.OMIT) {
                return undefined;
            }
            // IMPRECISE
            if (needBaseCoinFee === PRECISION.IMPRECISE && commissionPriceData) {
                const priceCoinPool = await getPoolInfo(0, commissionPriceData.coin.id, extraAxiosOptions);
                return getBaseCoinAmountFromPool(priceCoinFee, priceCoinPool);
            }
            if (needBaseCoinFee === PRECISION.IMPRECISE && !commissionPriceData) {
                // @TODO maybe just force commissionPriceData
                throw new Error('base coin fee imprecise estimation with omitted price coin is not implemented yet');
            }
            // @TODO precise estimation
            throw new Error('base coin fee precise estimation not implemented yet');
        })();

        // gasCoin
        let fee;
        if (sameGasAndPriceCoins) {
            // PRECISE
            // actual fee may be few pips less than priceCoinFee, assume it's not worth of extra http request
            fee = priceCoinFee;
        } else if (gasDependsOnBase) {
            // IMPRECISE
            fee = baseCoinFee;
        } else if (needGasCoinFee !== PRECISION.OMIT) {
            // PRECISE
            const {commission} = await estimateFeeDirect(txParams, axiosOptions);
            fee = commission;
        }

        if (baseDependsOnGas) {
            baseCoinFee = fee;
        }


        return {
            commission: fee,
            baseCoinCommission: baseCoinFee,
            priceCoinCommission: priceCoinFee,
            commissionPriceData,
        };
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
 * @param {CommissionPriceData} commissionPriceData
 * @return {boolean}
 */
function isGasCoinSameAsPriceCoin(gasCoinId, commissionPriceData) {
    return Number.parseInt(gasCoinId, 10) === Number.parseInt(commissionPriceData?.coin.id, 10);
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
    // reserveBase - (reservePrice * reserveBase) / (priceCoinAmount * 0.997 + reservePrice)
    let result = reserveBase.minus(reservePrice.times(reserveBase).div(priceCoinAmountPip.times(0.997).plus(reservePrice)));

    // received amount from pool rounds down, spent amount to pool rounds up
    // round down
    result = result.round(undefined, 0);

    return convertFromPip(result);
}

/**
 * @param {TxParams} txParams
 * @param {boolean} [disableValidation]
 * @return FeePriceOptions
 */
function getFeePriceOptionsFromTxParams(txParams, disableValidation) {
    const txType = txParams.type;
    if (!txType) {
        throw new Error('Tx `type` not specified');
    }

    const isTickerType = txType === TX_TYPE.CREATE_COIN || txType === TX_TYPE.CREATE_TOKEN;
    const coinSymbol = isTickerType ? txParams.data?.symbol : undefined;
    if (isTickerType && !coinSymbol && !disableValidation) {
        throw new Error('`symbol` not specified for ticker creation tx');
    }

    let deltaItemCount;
    if (txType === TX_TYPE.BUY_SWAP_POOL || txType === TX_TYPE.SELL_SWAP_POOL || txType === TX_TYPE.SELL_ALL_SWAP_POOL) {
        const coinCount = txParams.data?.coins?.length;
        if (!coinCount && !disableValidation) {
            throw new Error('Invalid `coins` field in swap pool tx');
        }
        // count of pools
        deltaItemCount = coinCount - 1;
    }
    if (txType === TX_TYPE.MULTISEND) {
        // count of recipients
        deltaItemCount = txParams.data?.list?.length;
        if (!deltaItemCount && !disableValidation) {
            throw new Error('Invalid `list` field in multisend tx');
        }
    }

    return {
        payload: txParams.payload,
        coinSymbol,
        deltaItemCount,
        fallbackOnInvalidInput: disableValidation,
    };
}
