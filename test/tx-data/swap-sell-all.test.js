import {SellAllSwapPoolTxData} from '~/src';

describe('SellAllSwapPoolTxData', () => {
    const txParamsData = {
        coinToSell: '0',
        coinToBuy: '1',
    };
    const txData = new SellAllSwapPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SellAllSwapPoolTxData.fromRlp(txData).fields;
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(txParamsData);
    });
});
