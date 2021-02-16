import {SellPoolTxData} from '~/src';

describe('SellPoolTxData', () => {
    const txParamsData = {
        coins: ['0', '1'],
        valueToSell: '20',
    };
    const txData = new SellPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SellPoolTxData.fromRlp(txData).fields;
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(txParamsData);
    });
});
