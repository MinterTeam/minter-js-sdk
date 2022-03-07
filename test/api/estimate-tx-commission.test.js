import {TX_TYPE} from 'minterjs-util';
import {ENV_DATA, minterGate, minterNode} from './variables';
import {testData} from '~/test/test-data.js';
import {logError} from '~/test/utils.js';

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

describe('EstimateTxCommission', () => {
    const txParamsData = (apiType, extraParams) => Object.assign({
        chainId: 2,
        type: TX_TYPE.SEND,
        data: {
            to: apiType.address,
            value: 10,
            coin: 0,
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

    test.each(API_TYPE_LIST)('tx string with direct %s', (apiType) => {
        expect.assertions(1);

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
        return Promise.all([apiType.estimateTxCommission(txParams, {loose: true}), apiType.estimateTxCommission(txParams, {direct: false})])
            .then(([feeLoose, feeIndirect]) => {
                expect(Number(feeLoose.commission)).toBeGreaterThan(0);
                expect(feeLoose).toEqual(feeIndirect);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
