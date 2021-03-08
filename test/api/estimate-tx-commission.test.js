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
    // {
    //     ...minterGate,
    //     address: ENV_DATA.address,
    //     toString() {
    //         return 'gate';
    //     },
    // },
];

describe('EstimateTxCommission', () => {
    const txParamsData = (apiType, data) => ({
        chainId: 2,
        type: TX_TYPE.SEND,
        data: Object.assign({
            to: apiType.address,
            value: 10,
            coin: 0,
        }, data),
        gasCoin: 0,
        payload: 'custom message',
    });

    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);
        const txParams = txParamsData(apiType);
        return Promise.all([apiType.estimateTxCommission(txParams, {direct: false}), apiType.estimateTxCommission(txParams, {direct: true})])
            .then(([feeCalculated, feeDirect]) => {
                expect(Number(feeCalculated.commission)).toBeGreaterThan(0);
                expect(feeCalculated.commission).toEqual(feeDirect.commission);
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
});
