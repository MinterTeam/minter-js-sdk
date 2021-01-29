import {CreateSwapPoolTxData} from '~/src';

describe('CreateSwapPoolTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        volume0: '20',
        volume1: '120',
    };
    const txData = new CreateSwapPoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = CreateSwapPoolTxData.fromRlp(txData).fields;
        delete params.maximumVolume1;
        expect(params)
            .toEqual(txParamsData);
    });
});
