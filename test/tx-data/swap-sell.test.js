import {SellSwapPoolTxData} from '~/src';

describe('SellSwapPoolTxData', () => {
    const txParamsData = {
        coinToSell: '0',
        coinToBuy: '1',
        valueToSell: '20',
    };
    const txData = new SellSwapPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SellSwapPoolTxData.fromRlp(txData).fields;
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(txParamsData);
    });
});
