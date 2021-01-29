import {BaseCoinFee, TX_TYPE} from 'minterjs-util';
import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin, logError} from '~/test/utils.js';

const API_TYPE_LIST = [
    {
        ...minterNode,
        toString() {
            return 'node';
        },
    },
    // {
    //     ...minterGate,
    //     toString() {
    //         return 'gate';
    //     },
    // },
];


describe('GetCommissionPrice', () => {
    test.each(API_TYPE_LIST)('should work %s', (apiType) => {
        expect.assertions(2);

        return apiType.getCommissionPrice({mapData: true})
            .then((commissionData) => {
                const baseCoinFee = new BaseCoinFee(commissionData);
                function getFeeValue() {
                    // eslint-disable-next-line prefer-rest-params
                    return parseFloat(baseCoinFee.getFeeValue(...arguments));
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
