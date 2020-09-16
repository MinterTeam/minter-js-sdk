import {RecreateCoinTxData} from '~/src';

describe('RecreateCoinTxData', () => {
    const txParamsData = {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: '5',
        constantReserveRatio: '10',
        initialReserve: '20',
        maxSupply: '1000000000000000',

    };
    const txData = new RecreateCoinTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = RecreateCoinTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
