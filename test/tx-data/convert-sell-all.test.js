import SellAllTxData from '~/src/tx-data/convert-sell-all';
import {clearData} from '~/test/utils';

describe('SellAllTxData', () => {
    const txParamsData = {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
    };
    const txData = new SellAllTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = clearData(SellAllTxData.fromRlp(txData));
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
