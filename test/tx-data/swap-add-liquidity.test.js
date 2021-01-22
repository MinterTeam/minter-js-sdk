import {AddLiquidityTxData} from '~/src';

describe('AddLiquidityTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        volume0: '20',
    };
    const txData = new AddLiquidityTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = AddLiquidityTxData.fromRlp(txData).fields;
        delete params.maximumVolume1;
        expect(params)
            .toEqual(txParamsData);
    });
});
