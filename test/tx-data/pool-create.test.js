import {CreatePoolTxData} from '~/src';

describe('CreatePoolTxData', () => {
    const txParamsData = {
        coin0: '0',
        coin1: '1',
        volume0: '20',
        volume1: '120',
    };
    const txData = new CreatePoolTxData(txParamsData).serialize();

    test('.fromRlp', () => {
        const params = CreatePoolTxData.fromRlp(txData).fields;
        delete params.maximumVolume1;
        expect(params)
            .toEqual(txParamsData);
    });
});
