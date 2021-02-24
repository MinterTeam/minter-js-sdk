import {CreateCoinTxData} from '~/src';

describe('CreateCoinTxData', () => {
    const txParamsData = {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: '5',
        constantReserveRatio: '10',
        initialReserve: '20',
        maxSupply: '1000000000000000',

    };
    const txData = new CreateCoinTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = CreateCoinTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });

    test('empty name', () => {
        expect(new CreateCoinTxData({...txParamsData, name: undefined}).serialize())
            .toEqual(new CreateCoinTxData({...txParamsData, name: ''}).serialize());
    });
});
