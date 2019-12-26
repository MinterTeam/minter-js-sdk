import BuyTxData from '~/src/tx-data/convert-buy';
import {clearData} from '~/test/utils';

describe('BuyTxData', () => {
    const txParamsData = {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
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
