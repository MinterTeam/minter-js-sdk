import {CreateCoinTxParams} from '~/src';
import {ENV_DATA, minterGate, minterNode} from './variables';

beforeAll(async () => {
    // ensure custom coin exists
    const txParams = new CreateCoinTxParams({
        privateKey: ENV_DATA.privateKey,
        chainId: 2,
        coinName: ENV_DATA.customCoin,
        coinSymbol: ENV_DATA.customCoin,
        initialAmount: 500,
        initialReserve: 1000,
        crr: 50,
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    });
    try {
        await minterGate.postTx(txParams);
    } catch (e) {
        console.log(e?.response.data || e);
    }
}, 30000);


describe('EstimateCoinSell', () => {
    test('should work gate', () => {
        expect.assertions(2);

        return minterGate.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_get)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        return minterGate.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_get)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        return minterNode.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateCoinBuy', () => {
    test('should work gate', () => {
        expect.assertions(2);

        return minterGate.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_pay)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail gate', () => {
        expect.assertions(1);
        return minterGate.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                // console.log(error);
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: ENV_DATA.customCoin,
        })
            .then((estimateResult) => {
                expect(Number(estimateResult.will_pay)).toBeGreaterThan(0);
                expect(Number(estimateResult.commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        return minterNode.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.error.message.length).toBeGreaterThan(0);
            });
    }, 30000);
});
