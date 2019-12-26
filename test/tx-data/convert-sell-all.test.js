import SellAllTxData from '~/src/tx-data/convert-sell-all';

describe('SellAllTxData', () => {
    const txParamsData = {
        coinToSell: 'MNT',
        coinToBuy: 'BELTCOIN',
    };
    const txData = new SellAllTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SellAllTxData.fromRlp(txData).fields;
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(txParamsData);
    });
});
