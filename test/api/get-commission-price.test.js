import {FeePrice, TX_TYPE} from 'minterjs-util';
import {minterGate, minterNode} from './variables.js';
import {logError} from '~/test/test-utils.js';

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


describe('GetCommissionPrice', () => {
    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);

        return apiType.getCommissionPrice()
            .then((commissionData) => {
                const feePrice = new FeePrice(commissionData);
                function getFeeValue() {
                    // eslint-disable-next-line prefer-rest-params
                    return parseFloat(feePrice.getFeeValue(...arguments));
                }

                expect(getFeeValue(TX_TYPE.SEND)).toBeGreaterThan(0);
                expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbolLength: 3})).toBeGreaterThan(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbolLength: 7}));
            })
            .catch((error) => {
                logError(error);
                throw error;
            });
    }, 30000);
});
