import {Minter, SendTxParams} from '~/src';

// private 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
// address Mx7633980c000139dd3bd24a3f54e06474fa941e16


const minterNode = new Minter({baseURL: 'https://minter-node-1.testnet.minter.network'});
const minterExplorer = new Minter();

describe('PostTx', () => {
    const txParamsData = {
        privateKey: '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da',
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'MNT',
        message: 'custom message',
    };

    test('should work explorer', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData);
        return minterExplorer.postTx(txParams)
            .then((txHash) => {
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail explorer', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData, coinSymbol: 'ASD'});
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData);
        return minterNode.postTx(txParams)
            .then((txHash) => {
                expect(txHash).toHaveLength(66);
                expect(txHash.substr(0, 2)).toEqual('Mt');
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should fail node', () => {
        expect.assertions(1);
        const txParams = new SendTxParams({...txParamsData, coinSymbol: 'ASD'});
        return minterNode.postTx(txParams)
            .catch((error) => {
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateCoinSell', () => {
    test('should work explorer', () => {
        expect.assertions(2);

        return minterExplorer.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'GORDEEV',
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

    test('should fail explorer', () => {
        expect.assertions(1);
        return minterExplorer.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinSell({
            coinToSell: 'MNT',
            valueToSell: 1,
            coinToBuy: 'GORDEEV',
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
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateCoinBuy', () => {
    test('should work explorer', () => {
        expect.assertions(2);

        return minterExplorer.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'GORDEEV',
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

    test('should fail explorer', () => {
        expect.assertions(1);
        return minterExplorer.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'MNT',
        })
            .catch((error) => {
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'GORDEEV',
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
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);
});

describe('EstimateTxCommission', () => {
    const rawTx = 'f8911a018a4d4e540000000000000001aae98a4d4e5400000000000000947633980c000139dd3bd24a3f54e06474fa941e16888ac7230489e800008e637573746f6d206d6573736167658001b845f8431ca0c0716faaac63263c8c6106fa17f863eec2de60431214dd8d775147d4ed972410a05f881fb3938acf69a0a7eb761e5479fbbd60780e1db0c85a0670150eb7b070ab';

    test('should work explorer', () => {
        expect.assertions(1);

        return minterExplorer.estimateTxCommission({
            transaction: rawTx,
        })
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(1);

        return minterNode.estimateTxCommission({
            transaction: rawTx,
        })
            .then((commission) => {
                expect(Number(commission)).toBeGreaterThan(0);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
            });
    }, 30000);
});
