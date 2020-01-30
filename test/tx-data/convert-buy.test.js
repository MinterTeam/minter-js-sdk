import {BuyTxData} from '~/src';
import {clearData} from '~/test/utils';

describe('BuyTxData', () => {
    const txParamsData = {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
        valueToBuy: 20,
    };
    const txData = new BuyTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(BuyTxData.fromRlp(txData));
        delete params.maximumValueToSell;
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
