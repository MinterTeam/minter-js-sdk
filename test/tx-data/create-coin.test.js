import CreateCoinTxData from '~/src/tx-data/create-coin';

describe('CreateCoinTxData', () => {
    const txParamsData = {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: '5',
        constantReserveRatio: 10,
        initialReserve: '20',
    };
    const txData = new CreateCoinTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = CreateCoinTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
