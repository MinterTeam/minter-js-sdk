import {Buffer} from 'safe-buffer';
import {TX_TYPE_SEND, TX_TYPE_CREATE_COIN, TX_TYPE_SELL_COIN, TX_TYPE_SELL_ALL_COIN, TX_TYPE_BUY_COIN} from 'minterjs-tx/src/tx-types';
import {SendTxParams, CreateCoinTxParams, SellTxParams, SellAllTxParams, BuyTxParams} from '~/src';


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
        txType: TX_TYPE_SEND,
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
        txType: TX_TYPE_CREATE_COIN,
        txData: Buffer.from([231, 135, 77, 121, 32, 67, 111, 105, 110, 138, 77, 89, 67, 79, 73, 78, 0, 0, 0, 0, 136, 69, 99, 145, 130, 68, 244, 0, 0, 137, 1, 21, 142, 70, 9, 19, 208, 0, 0, 10]),
    };

    test('fields', () => {
        const txParams = new CreateCoinTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
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
        txType: TX_TYPE_SELL_COIN,
        txData: Buffer.from([223, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0]),
    };

    test('fields', () => {
        const txParams = new SellTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
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
        txType: TX_TYPE_SELL_ALL_COIN,
        txData: Buffer.from([214, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0]),
    };

    test('fields', () => {
        const txParams = new SellAllTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
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
        feeCoinSymbol: 'ASD',
        message: 'custom message',
    };
    const validTxParams = {
        privateKey,
        gasCoin: 'ASD',
        message: 'custom message',
        txType: TX_TYPE_BUY_COIN,
        txData: Buffer.from([223, 138, 66, 69, 76, 84, 67, 79, 73, 78, 0, 0, 136, 138, 199, 35, 4, 137, 232, 0, 0, 138, 77, 78, 84, 0, 0, 0, 0, 0, 0, 0]),
    };

    test('fields', () => {
        const txParams = new BuyTxParams(txParamsData);

        expect(txParams)
            .toEqual(validTxParams);
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
