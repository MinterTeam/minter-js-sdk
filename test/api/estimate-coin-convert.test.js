import {ENV_DATA, minterGate, minterNode} from './variables';
import {ensureCustomCoin} from '~/test/utils.js';

beforeAll(async () => {
    await ensureCustomCoin();
}, 30000);


describe('EstimateCoinSell', () => {
    describe('symbol', () => {
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
                    console.log(error);
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

    describe('id', () => {
        test('should work gate', () => {
            expect.assertions(2);

            return minterGate.estimateCoinSell({
                coinIdToSell: 0,
                valueToSell: 1,
                coinIdToBuy: 1,
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
                coinIdToSell: 0,
                valueToSell: 1,
                coinIdToBuy: 0,
            })
                .catch((error) => {
                    console.log(error);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);

        test('should work node', () => {
            expect.assertions(2);

            return minterNode.estimateCoinSell({
                coinIdToSell: 0,
                valueToSell: 1,
                coinIdToBuy: 1,
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
                coinIdToSell: 0,
                valueToSell: 1,
                coinIdToBuy: 0,
            })
                .catch((error) => {
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });
});

describe('EstimateCoinBuy', () => {
    describe('symbol', () => {
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
                    // console.log(error.response.data);
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

    describe('id', () => {
        test('should work gate', () => {
            expect.assertions(2);

            return minterGate.estimateCoinBuy({
                coinIdToSell: 0,
                valueToBuy: 1,
                coinIdToBuy: 1,
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
                coinIdToSell: 0,
                valueToBuy: 1,
                coinIdToBuy: 0,
            })
                .catch((error) => {
                    // console.log(error.response.data);
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);

        test('should work node', () => {
            expect.assertions(2);

            return minterNode.estimateCoinBuy({
                coinIdToSell: 0,
                valueToBuy: 1,
                coinIdToBuy: 1,
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
                coinIdToSell: 0,
                valueToBuy: 1,
                coinIdToBuy: 0,
            })
                .catch((error) => {
                    expect(error.response.data.error.message.length).toBeGreaterThan(0);
                });
        }, 30000);
    });
});
