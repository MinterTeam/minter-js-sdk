import {TX_TYPE, txTypeList} from 'minterjs-util';
import {FEE_PRECISION_SETTING} from '~/src';
import {testData} from '~/test/test-data.js';
import {logError} from '~/test/test-utils.js';
import {ENV_DATA, minterGate, minterNode} from './variables';

/**
 * @type {Array<Minter>}
 */
const API_TYPE_LIST = [
    {
        ...minterNode,
        address: ENV_DATA.address2,
        toString() {
            return 'node';
        },
    },
    {
        ...minterGate,
        address: ENV_DATA.address,
        toString() {
            return 'gate';
        },
    },
];

const typeList = txTypeList
    .filter((typeItem) => !typeItem.isDisabled)
    .map((typeItem) => {
        return {
            ...typeItem,
            toString: () => `${typeItem.hex} ${typeItem.key}`,
        };
    });

describe('EstimateTxCommission', () => {
    const txParamsData = (apiType, extraParams, extraData) => Object.assign({
        chainId: 2,
        type: TX_TYPE.SEND,
        data: {
            to: apiType.address,
            value: 10,
            coin: 0,
            ...extraData,
        },
        gasCoin: 0,
        payload: 'custom message',
    }, extraParams);

    function getDifferencePercent(a, b) {
        return Math.abs(1 - a / b) * 100;
    }

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return Promise.all([apiType.estimateTxCommission(txParams, {loose: true}), apiType.estimateTxCommission(txParams, {loose: false})])
            .then(([feeCalculated, feeDirect]) => {
                expect(Number(feeCalculated.commission)).toBeGreaterThan(0);
                // limit orders not considered so make approx comparison
                const diffPercent = getDifferencePercent(feeCalculated.commission, feeDirect.commission);
                expect(diffPercent).toBeLessThanOrEqual(1);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work with gasCoin symbol %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType, {gasCoin: 'MNT'});
        return Promise.all([apiType.estimateTxCommission(txParams, {loose: true}), apiType.estimateTxCommission(txParams, {loose: false})])
            .then(([feeCalculated, feeDirect]) => {
                expect(Number(feeCalculated.commission)).toBeGreaterThan(0);
                // limit orders not considered so make approx comparison
                const diffPercent = getDifferencePercent(feeCalculated.commission, feeDirect.commission);
                expect(diffPercent).toBeLessThanOrEqual(1);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('empty SendData equal to not empty %s', (apiType) => {
        expect.assertions(1);
        const txParams = txParamsData(apiType);
        return Promise.all([
            apiType.estimateTxCommission({...txParams, data: {}}, {}),
            apiType.estimateTxCommission(txParams, {}),
        ])
            .then(([feeWithoutData, fee]) => {
                expect(feeWithoutData.commission).toEqual(fee.commission);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    describe('works with coin symbols', () => {
        const getTxParamsWithCoinSymbols = (apiType) => txParamsData(apiType, {gasCoin: 'MNT'}, {coin: 'MNT'});

        test.each(API_TYPE_LIST)('direct %s', (apiType) => {
            expect.assertions(1);
            const txParams = getTxParamsWithCoinSymbols(apiType);
            return apiType.estimateTxCommission(txParams, {needGasCoinFee: FEE_PRECISION_SETTING.PRECISE})
                .then((feeData) => {
                    expect(Number(feeData.commission)).toBeGreaterThan(0);
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);

        test.each(API_TYPE_LIST)('loose %s', (apiType) => {
            expect.assertions(1);
            const txParams = getTxParamsWithCoinSymbols(apiType);
            return apiType.estimateTxCommission(txParams, {
                needGasCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
                needBaseCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
                needPriceCoinFee: FEE_PRECISION_SETTING.PRECISE,
            })
                .then((feeData) => {
                    expect(Number(feeData.commission)).toBeGreaterThan(0);
                })
                .catch((error) => {
                    logError(error);
                    throw error;
                });
        }, 30000);
    });

    describe.each(API_TYPE_LIST)('direct with empty: %s', (apiType) => {
        test.each(typeList)('works empty %s', ({hex: txType}) => {
            return testDirectEstimationWithEmptyData(apiType, txType);
        });
    });

    test.each(API_TYPE_LIST)('tx string with direct %s', async (apiType) => {
        expect.assertions(1);

        // const testData = await import('~/test/test-data.js');
        // @TODO try dynamic import, because test-data evaluate too much TxData constructors
        const rawTx = testData.txList[0].result;

        return apiType.estimateTxCommission(rawTx)
            .then((feeData) => {
                expect(Number(feeData.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work deprecated `direct` option %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return Promise.all([apiType.estimateTxCommission(txParams, {
            needGasCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
            needBaseCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
            needPriceCoinFee: FEE_PRECISION_SETTING.PRECISE,
        }), apiType.estimateTxCommission(txParams, {direct: false})])
            .then(([feeLoose, feeIndirect]) => {
                expect(Number(feeLoose.commission)).toBeGreaterThan(0);
                expect(feeLoose).toEqual(feeIndirect);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work deprecated `loose` option %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return Promise.all([apiType.estimateTxCommission(txParams, {
            needGasCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
            needBaseCoinFee: FEE_PRECISION_SETTING.IMPRECISE,
            needPriceCoinFee: FEE_PRECISION_SETTING.PRECISE,
        }), apiType.estimateTxCommission(txParams, {loose: true})])
            .then(([feeLoose, feeIndirect]) => {
                expect(Number(feeLoose.commission)).toBeGreaterThan(0);
                expect(feeLoose).toEqual(feeIndirect);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    function testDirectEstimationWithEmptyData(apiType, txType) {
        expect.assertions(1);
        const txParams = txParamsData(apiType);
        return apiType.estimateTxCommission({
            ...txParams,
            data: {},
            type: txType,
        }, {needGasCoinFee: FEE_PRECISION_SETTING.PRECISE})
            .then((feeData) => {
                expect(Number(feeData.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }
});
