import {CreateTokenTxData} from '~/src';

describe('CreateTokenTxData', () => {
    const txParamsData = {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: '5',
        maxSupply: '1000000000000000',
        mintable: true,
        burnable: true,

    };
    const txData = new CreateTokenTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = CreateTokenTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
