import {logError} from '~/test/test-utils.js';
import {minterGate, minterNode} from './variables.js';

const API_TYPE_LIST = [
    {
        ...minterNode,
        toString() {
            return 'node';
        },
    },
    {
        ...minterGate,
        toString() {
            return 'gate';
        },
    },
];


describe('GetPoolInfo', () => {
    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(1);

        // @TODO get proper pool pair
        return apiType.getPoolInfo(0, 1993)
            .then((poolInfo) => {
                expect(Number(poolInfo.amount0)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);

    test.each(API_TYPE_LIST)('should work coin symbol %s', (apiType) => {
        expect.assertions(1);

        // @TODO get proper pool pair
        return apiType.getPoolInfo('MNT', 'USDTE')
            .then((poolInfo) => {
                expect(Number(poolInfo.amount0)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
