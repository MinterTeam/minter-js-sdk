import {AddLimitOrderTxData} from '~/src';

describe('AddLimitOrderTxData', () => {
    const txParamsData = {
        coinToSell: '0',
        coinToBuy: '1',
        valueToSell: '20',
        valueToBuy: '20',
    };
    const txData = new AddLimitOrderTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = AddLimitOrderTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
