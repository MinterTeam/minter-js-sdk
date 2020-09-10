import {BuyTxData} from '~/src';
import {clearData} from '~/test/utils';

describe('BuyTxData', () => {
    const txParamsData = {
        coinToSell: '0',
        coinToBuy: '1',
        valueToBuy: '20',
    };
    const txData = new BuyTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = BuyTxData.fromRlp(txData).fields;
        delete params.maximumValueToSell;
        expect(params)
            .toEqual(txParamsData);
    });
});
