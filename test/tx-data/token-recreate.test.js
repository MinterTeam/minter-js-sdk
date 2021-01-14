import {RecreateTokenTxData} from '~/src';

describe('RecreateTokenTxData', () => {
    const txParamsData = {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: '5',
        maxSupply: '1000000000000000',
        mintable: true,
        burnable: true,

    };
    const txData = new RecreateTokenTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = RecreateTokenTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
