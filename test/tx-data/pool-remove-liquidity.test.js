import {RemoveLiquidityTxData} from '~/src';

describe('RemoveLiquidityTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        liquidity: '20',
    };
    const txData = new RemoveLiquidityTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = RemoveLiquidityTxData.fromRlp(txData).fields;
        delete params.minimumVolume0;
        delete params.minimumVolume1;
        expect(params)
            .toEqual(txParamsData);
    });
});
