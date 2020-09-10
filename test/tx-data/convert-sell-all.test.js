import {SellAllTxData} from '~/src';

describe('SellAllTxData', () => {
    const txParamsData = {
        coinToSell: '0',
        coinToBuy: '1',
    };
    const txData = new SellAllTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SellAllTxData.fromRlp(txData).fields;
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(txParamsData);
    });
});
