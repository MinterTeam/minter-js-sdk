import {BuySwapPoolTxData} from '~/src';
import {clearData} from '~/test/utils';

describe('BuySwapPoolTxData', () => {
    const txParamsData = {
        coinToSell: '0',
        coinToBuy: '1',
        valueToBuy: '20',
    };
    const txData = new BuySwapPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = BuySwapPoolTxData.fromRlp(txData).fields;
        delete params.maximumValueToSell;
        expect(params)
            .toEqual(txParamsData);
    });
});
