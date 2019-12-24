import CreateCoinTxData from '~/src/tx-data/create-coin';
import {clearData} from '~/test/utils';

describe('CreateCoinTxData', () => {
    const txParamsData = {
        name: 'My Coin',
        symbol: 'MYCOIN',
        initialAmount: 5,
        constantReserveRatio: 10,
        initialReserve: 20,
    };
    const txData = new CreateCoinTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(CreateCoinTxData.fromRlp(txData));
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
