import {Minter, SendTxParams} from '~/src';
import {API_TYPE_EXPLORER, API_TYPE_NODE} from '~/src/variables';

// mnemonic: exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone
// private: 5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da
// address: Mx7633980c000139dd3bd24a3f54e06474fa941e16


// const minterNode = new Minter({apiType: API_TYPE_NODE, baseURL: 'https://minter-node-1.testnet.minter.network'});
// const minterExplorer = new Minter({apiType: API_TYPE_EXPLORER, baseURL: 'https://testnet.explorer.minter.network'});
const minterNode = new Minter({apiType: API_TYPE_NODE, baseURL: 'http://159.89.107.246:8841'});
const minterExplorer = new Minter({apiType: API_TYPE_EXPLORER, baseURL: 'https://testnet2.explorer.minter.network'});

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
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
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
        const txParams = new SendTxParams({...txParamsData, coinSymbol: 'ASD999'});
        return minterExplorer.postTx(txParams)
            .catch((error) => {
                // console.log(error);
                // console.log(error.response);
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 70000);

    test('should work node', async () => {
        // wait for getNonce to work correctly
        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });
        expect.assertions(2);
        const txParams = new SendTxParams(txParamsData);
        return minterNode.postTx(txParams)
            .then((txHash) => {
                // console.log(txHash);
                // txHash = txHash.replace(/^Mt/);
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
        const txParams = new SendTxParams({...txParamsData, amount: Number.MAX_SAFE_INTEGER, coinSymbol: 'ASD999'});
        return minterNode.postTx(txParams)
            .then((res) => {
                console.log({res});
            })
            .catch((error) => {
                // console.log(error.response.data);
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
            coinToBuy: 'TESTCOIN01',
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
            coinToBuy: 'TESTCOIN01',
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
            coinToBuy: 'TESTCOIN01',
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
                console.log(error);
                expect(error.response.data.log.length).toBeGreaterThan(0);
            });
    }, 30000);

    test('should work node', () => {
        expect.assertions(2);

        return minterNode.estimateCoinBuy({
            coinToSell: 'MNT',
            valueToBuy: 1,
            coinToBuy: 'TESTCOIN01',
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
