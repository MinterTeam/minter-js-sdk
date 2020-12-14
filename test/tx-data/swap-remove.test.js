import {RemoveSwapPoolTxData} from '~/src';

describe('RemoveSwapPoolTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        liquidity: '20',
    };
    const txData = new RemoveSwapPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = RemoveSwapPoolTxData.fromRlp(txData).fields;
        delete params.minimumVolume0;
        delete params.minimumVolume1;
        expect(params)
            .toEqual(txParamsData);
    });
});
