import SellTxData from '~/src/tx-data/convert-sell';
import {clearData} from '~/test/utils';

describe('SellTxData', () => {
    const txParamsData = {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
        valueToSell: 20,
    };
    const txData = new SellTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(SellTxData.fromRlp(txData));
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
