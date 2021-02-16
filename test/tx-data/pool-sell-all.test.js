import {SellAllPoolTxData} from '~/src';

describe('SellAllPoolTxData', () => {
    const txParamsData = {
        coins: ['0', '1'],
    };
    const txData = new SellAllPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = SellAllPoolTxData.fromRlp(txData).fields;
        delete params.minimumValueToBuy;
        expect(params)
            .toEqual(txParamsData);
    });
});
