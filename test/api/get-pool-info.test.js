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
    test.skip.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(1);

        // @TODO get proper pool pair
        return apiType.getPoolInfo(0, 1833)
            .then((poolInfo) => {
                expect(Number(poolInfo.amount0)).toBeGreaterThan(0);
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
