import {TX_TYPE} from 'minterjs-tx';
import {SendTxParams, CreateCoinTxParams, SellTxParams, SellAllTxParams, BuyTxParams} from '~/src';
import {MAX_MAX_SUPPLY} from '~/src/tx-params/create-coin';


describe('SendTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        address: 'Mx7633980c000139dd3bd24a3f54e06474fa941e16',
        amount: 10,
        coinSymbol: 'MNT',
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE.SEND,
        txData: Buffer.from([233, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 148, 118, 51, 152, 12, 0, 1, 57, 221, 59, 210, 74, 63, 84, 224, 100, 116, 250, 148, 30, 22, 136, 138, 199, 35, 4, 137, 232, 0, 0]),
    };

    test('fields', () => {
        const txParams = new SendTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default gasCoin', () => {
        const txParams = new SendTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinSymbol,
            });
    });
});

describe('CreateCoinTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        coinName: 'My Coin',
        coinSymbol: 'MYCOIN',
        initialAmount: 5,
        crr: 10,
        initialReserve: 20,
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE.CREATE_COIN,
        txData: Buffer.from([246, 135, 77, 121, 32, 67, 111, 105, 110, 138, 77, 89, 67, 79, 73, 78, 0, 0, 0, 0, 136, 69, 99, 145, 130, 68, 244, 0, 0, 137, 1, 21, 142, 70, 9, 19, 208, 0, 0, 10, 142, 49, 77, 198, 68, 141, 147, 56, 193, 91, 10, 0, 0, 0, 0]),
    };

    test('fields', () => {
        const txParams = new CreateCoinTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('default maxSupply', () => {
        expect(new CreateCoinTxParams({
            ...txParamsData,
            maxSupply: undefined,
        }))
            .toEqual(new CreateCoinTxParams({
                ...txParamsData,
                maxSupply: MAX_MAX_SUPPLY,
            }));
    });

    test('default gasCoin', () => {
        const txParams = new CreateCoinTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinFrom,
            });
    });

    test('numeric coin name should be treated as string', () => {
        expect(new CreateCoinTxParams({
            ...txParamsData,
            coinName: 123,
        })).toEqual(new CreateCoinTxParams({
            ...txParamsData,
            coinName: '123',
        }));
    });

    test('throw on too small maxSupply', () => {
        expect(() => new CreateCoinTxParams({
            ...txParamsData,
            maxSupply: 0,
        })).toThrow();
    });

    test('throw on too big maxSupply', () => {
        expect(() => new CreateCoinTxParams({
            ...txParamsData,
            maxSupply: Number.MAX_SAFE_INTEGER,
        })).toThrow();
    });

    test('throw on initialAmount more than maxSupply', () => {
        expect(() => new CreateCoinTxParams({
            ...txParamsData,
            initialAmount: 100,
            maxSupply: 10,
        })).toThrow();
    });
});

describe('SellTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        coinFrom: 'MNT',
        coinTo: 'BELTCOIN',
        sellAmount: 10,
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE.SELL,
        txData: Buffer.from([224, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 128]),
    };

    test('fields', () => {
        const txParams = new SellTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('minBuyAmount', () => {
        const txParams = new SellTxParams({
            ...txParamsData,
            minBuyAmount: 5,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                txData: Buffer.from([232, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 136, 69, 99, 145, 130, 68, 244, 0, 0]),
            });
    });

    test('default gasCoin', () => {
        const txParams = new SellTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinFrom,
            });
    });
});

describe('SellAllTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        coinFrom: 'MNT',
        coinTo: 'BELTCOIN',
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE.SELL_ALL,
        txData: Buffer.from([215, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 128]),
    };

    test('fields', () => {
        const txParams = new SellAllTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('minBuyAmount', () => {
        const txParams = new SellAllTxParams({
            ...txParamsData,
            minBuyAmount: 5,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                txData: Buffer.from([223, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 136, 69, 99, 145, 130, 68, 244, 0, 0]),
            });
    });

    test('default gasCoin', () => {
        const txParams = new SellAllTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinFrom,
            });
    });
});

describe('BuyTxParams', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const txParamsData = {
        privateKey,
        coinFrom: 'MNT',
        coinTo: 'BELTCOIN',
        buyAmount: 10,
        maxSellAmount: 0,
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE.BUY,
        txData: Buffer.from([224, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 128]),
    };

    test('fields', () => {
        const txParams = new BuyTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
    });

    test('maxSellAmount', () => {
        const txParams = new BuyTxParams({
            ...txParamsData,
            maxSellAmount: 5,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                txData: Buffer.from([232, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 136, 69, 99, 145, 130, 68, 244, 0, 0]),
            });
    });

    test('default maxSellAmount', () => {
        const txParams = new BuyTxParams({
            ...txParamsData,
            maxSellAmount: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                txData: Buffer.from([239, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 143, 1, 188, 22, 214, 116, 236, 127, 242, 31, 73, 76, 88, 156, 0, 0]),
            });
    });

    test('default gasCoin', () => {
        const txParams = new BuyTxParams({
            ...txParamsData,
            feeCoinSymbol: undefined,
        });

        expect(txParams)
            .toEqual({
                ...validTxParams,
                gasCoin: txParamsData.coinFrom,
            });
    });
});
