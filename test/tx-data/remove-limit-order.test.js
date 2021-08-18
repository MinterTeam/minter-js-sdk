import {RemoveLimitOrderTxData} from '~/src';

describe('RemoveLimitOrderTxData', () => {
    const txParamsData = {
        id: '123456789',
    };
    const txData = new RemoveLimitOrderTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = RemoveLimitOrderTxData.fromRlp(txData).fields;
        expect(params)
            .toEqual(txParamsData);
    });
});
