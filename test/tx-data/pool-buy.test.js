import {BuyPoolTxData} from '~/src';
import {clearData} from '~/test/test-utils.js';

describe('BuyPoolTxData', () => {
    const txParamsData = {
        coins: ['1', '0'],
        valueToBuy: '20',
    };
    const txData = new BuyPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = BuyPoolTxData.fromRlp(txData).fields;
        delete params.maximumValueToSell;
        expect(params)
            .toEqual(txParamsData);
    });
});
